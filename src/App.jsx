import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import ToastContainer from './components/ToastContainer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConsoleLogs from './components/ConsoleLogs';
import DashboardTab from './components/tabs/DashboardTab';
import WindowsTweaksTab from './components/tabs/WindowsTweaksTab';
import NetworkTab from './components/tabs/NetworkTab';
import FiveMTab from './components/tabs/FiveMTab';
import HardwareTab from './components/tabs/HardwareTab';
import SettingsTab from './components/tabs/SettingsTab';
import AuthModal from './components/AuthModal';

const TAB_COMPONENTS = {
  dashboard: <DashboardTab />,
  windows: <WindowsTweaksTab />,
  network: <NetworkTab />,
  fivem: <FiveMTab />,
  hardware: <HardwareTab />,
  settings: <SettingsTab />
};

export default function App() {
  const { activeTab, authenticated, setSpecs, addLog } = useStore();

  useEffect(() => {
    fetch("http://localhost:8888/api/specs")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.cpu) {
          setSpecs(data);
          addLog("SYSTEM", `Hardware detected: ${data.cpu} | ${data.gpu} | ${data.ramTotal}`);
        }
      })
      .catch(() => {
        try {
          const detected = {};
          if (navigator.hardwareConcurrency) {
            detected.cores = `${navigator.hardwareConcurrency} Logical Cores`;
          }
          if (navigator.deviceMemory) {
            detected.ramTotal = `${navigator.deviceMemory}.0 GB`;
            detected.ramTotalNum = navigator.deviceMemory;
          }
          if (window.screen) {
            detected.resolution = `${window.screen.width} x ${window.screen.height}`;
          }
          const gl = document.createElement("canvas").getContext("webgl");
          const ext = gl && gl.getExtension("WEBGL_debug_renderer_info");
          if (ext) {
            const ren = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            if (ren) {
              const clean = ren.replace(/ANGLE \(([^,]+).*\)/, "$1").replace(/Direct3D.*/, "").trim();
              detected.gpu = clean;
              detected.gpuShort = clean.replace(/NVIDIA GeForce |AMD Radeon /g, "");
            }
          }
          setSpecs(detected);
        } catch (e) {}
      });
  }, [setSpecs, addLog]);

  if (!authenticated) return <AuthModal />;

  return (
    <div className="h-screen w-screen flex flex-col bg-matte bg-grid bg-noise overflow-hidden">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto p-6">
            <div key={activeTab} className="animate-fade-in">
              {TAB_COMPONENTS[activeTab] || TAB_COMPONENTS.dashboard}
            </div>
          </div>
          <div className="h-48 shrink-0 p-3 pt-0">
            <ConsoleLogs />
          </div>
        </div>
      </div>
    </div>
  );
}
