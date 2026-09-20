import { create } from 'zustand';

let toastCounter = 0;
const generateId = () => `id-${++toastCounter}`;
const getFormattedTime = () => new Date().toLocaleTimeString("en-US", { hour12: false });

const getBrowserHwid = () => {
  const storageKey = 'versx_browser_hwid';
  let id = localStorage.getItem(storageKey);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(storageKey, id);
  }
  return id;
};

export const useStore = create((set) => ({
  authenticated: sessionStorage.getItem('versx_authenticated') === '1',
  authUser: null,
  toasts: [],
  logs: [
    {
      id: generateId(),
      timestamp: getFormattedTime(),
      level: "SYSTEM",
      message: "VERSX Performance System initialized. Authentication ready."
    }
  ],
  activeTab: "dashboard",
  specs: {
    os: "Detecting Windows...",
    osShort: "System: Windows",
    cpu: "Detecting CPU...",
    cores: "Detecting Cores...",
    clock: "Detecting...",
    gpu: "Detecting GPU...",
    gpuShort: "GPU",
    vram: "Detecting...",
    ramTotal: "16.0 GB DDR4",
    ramTotalNum: 16,
    ramSpeed: "3200 MHz",
    resolution: "1920 x 1080"
  },
  setSpecs: (newSpecs) => set((state) => ({ specs: { ...state.specs, ...newSpecs } })),

  addToast: (toast) => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })), 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  addLog: (level, message) => set((state) => ({
    logs: [...state.logs.slice(-99), { id: generateId(), timestamp: getFormattedTime(), level, message }]
  })),

  clearLogs: () => set({ logs: [] }),
  setAuthenticated: (authenticated) => {
    if (authenticated) sessionStorage.setItem('versx_authenticated', '1');
    else sessionStorage.removeItem('versx_authenticated');
    set({ authenticated });
  },
  setActiveTab: (activeTab) => set({ activeTab }),

  initKeyAuth: async () => true,

  loginKeyAuth: async (license) => {
    try {
      const response = await fetch('/api/keyauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'license', license, hwid: getBrowserHwid() })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Invalid license key.' };
      }

      set({ authenticated: true, authUser: data.user || null });
      sessionStorage.setItem('versx_authenticated', '1');
      return data;
    } catch (error) {
      return { success: false, message: 'Unable to connect to authentication server.' };
    }
  },

  logout: () => {
    sessionStorage.removeItem('versx_authenticated');
    set({ authenticated: false, authUser: null });
  }
}));
