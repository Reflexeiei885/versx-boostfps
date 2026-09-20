import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  Wifi,
  Gamepad2,
  Cpu,
  Settings,
  Zap
} from 'lucide-react';
import { useStore } from '../store/useStore';

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "windows", label: "Windows Tweaks", icon: Wrench },
  { id: "network", label: "Network & Ping", icon: Wifi },
  { id: "fivem", label: "FiveM Optimization", icon: Gamepad2 },
  { id: "hardware", label: "Hardware & GPU", icon: Cpu },
  { id: "settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <aside className="w-60 shrink-0 glass-strong border-r border-white/5 flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-glow-green/10 border border-glow-green/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-glow-green" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">Boost FPS Ghet</p>
            <p className="text-xs text-accent/50 font-mono">v1.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-glow-green/10 text-glow-green border border-glow-green/20"
                  : "text-accent hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-glow-green rounded-r-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-accent/40">
          <span className="w-2 h-2 rounded-full bg-glow-green animate-pulse-glow" />
          <span className="font-mono">System Connected</span>
        </div>
      </div>
    </aside>
  );
}
