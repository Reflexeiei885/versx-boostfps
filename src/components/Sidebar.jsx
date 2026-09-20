import React from 'react';
import { LayoutDashboard, Wrench, Wifi, Gamepad2, Cpu, Settings, Terminal } from 'lucide-react';
import { useStore } from '../store/useStore';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', code: '01', icon: LayoutDashboard },
  { id: 'windows', label: 'Windows Tweaks', code: '02', icon: Wrench },
  { id: 'network', label: 'Network & Ping', code: '03', icon: Wifi },
  { id: 'fivem', label: 'FiveM Optimization', code: '04', icon: Gamepad2 },
  { id: 'hardware', label: 'Hardware & GPU', code: '05', icon: Cpu },
  { id: 'settings', label: 'Settings', code: '06', icon: Settings }
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useStore();
  return (
    <aside className="vx-sidebar">
      <div className="vx-brand">
        <div className="vx-brand-mark"><span>V</span></div>
        <div><div className="vx-brand-name">VERSX<span>.</span></div><div className="vx-brand-sub">PERFORMANCE SYSTEM</div></div>
      </div>
      <div className="vx-side-label"><Terminal size={12}/> MODULES</div>
      <nav className="vx-nav">
        {NAV_ITEMS.map(({ id, label, code, icon: Icon }) => {
          const active = activeTab === id;
          return <button key={id} onClick={() => setActiveTab(id)} className={`vx-nav-item ${active ? 'active' : ''}`}>
            <span className="vx-nav-code">{code}</span><Icon size={16}/><span>{label}</span>{active && <i/>}
          </button>;
        })}
      </nav>
      <div className="vx-side-bottom">
        <div className="vx-live"><span/> SYSTEM ONLINE <b>01</b></div>
        <div className="vx-version">VERSX CORE // v1.0</div>
      </div>
    </aside>
  );
}
