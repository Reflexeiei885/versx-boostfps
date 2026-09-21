import React, { useState } from 'react';
import { RotateCcw, TriangleAlert, Activity, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const { addLog, addToast, specs } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const handleReset = () => {
    addLog('WARNING', 'Resetting all tweaks to default configuration...');
    addToast({ type: 'warning', title: 'Reset Complete', message: 'All tweaks reverted to default.' });
    setShowConfirm(false);
    setTimeout(() => addLog('SUCCESS', 'System restored to default state.'), 800);
  };
  return <>
    <header className="vx-header">
      <div className="vx-header-left">
        <div className="vx-breadcrumb"><span>VERSX</span><b>/</b><strong>{specs.osShort || 'WINDOWS'}</strong></div>
        <div className="vx-header-status"><Activity size={13}/> ACTIVE SESSION</div>
      </div>
      <div className="vx-header-right">
        <div className="vx-secure"><ShieldCheck size={13}/> SECURE</div>
        <button className="vx-reset" onClick={() => setShowConfirm(true)}><RotateCcw size={14}/> RESET</button>
      </div>
    </header>
    {showConfirm && <div className="vx-modal-backdrop">
      <div className="vx-confirm">
        <div className="vx-modal-icon"><TriangleAlert size={20}/></div>
        <div><div className="vx-modal-kicker">SYSTEM ACTION // 0x01</div><h3>RESET CONFIGURATION?</h3><p>This will revert all optimizations, toggles, and settings back to their default values.</p></div>
        <div className="vx-modal-actions"><button onClick={() => setShowConfirm(false)}>CANCEL</button><button className="danger" onClick={handleReset}><RotateCcw size={14}/> RESET NOW</button></div>
      </div>
    </div>}
  </>;
}
