import React, { useState, useEffect } from 'react';
import { ShieldCheck, KeyRound, LoaderCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
export default function AuthModal() {
  const { loginKeyAuth, initKeyAuth, addToast } = useStore();
  const [key, setKey] = useState(''); const [remember, setRemember] = useState(true); const [isLoading, setIsLoading] = useState(false);
  useEffect(() => { initKeyAuth(); const saved = localStorage.getItem('saved_license_key'); if (saved) setKey(saved); }, [initKeyAuth]);
  const handleSubmit = async () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) return addToast({ type: 'error', title: 'Invalid Key', message: 'Please enter a license key.' });
    setIsLoading(true); const result = await loginKeyAuth(trimmedKey); setIsLoading(false);
    if (result.success) { if (remember) localStorage.setItem('saved_license_key', trimmedKey); else localStorage.removeItem('saved_license_key'); }
  };
  return <main className="vx-auth">
    <div className="vx-auth-grid"/><div className="vx-auth-glow"/>
    <div className="vx-auth-wrap">
      <div className="vx-auth-top"><div className="vx-auth-logo"><span>V</span></div><div><div className="vx-auth-brand">VERSX<span>.</span></div><div className="vx-auth-sub">PERFORMANCE SYSTEM / ACCESS GATE</div></div><div className="vx-auth-online"><i/> ONLINE</div></div>
      <div className="vx-auth-line"/>
      <div className="vx-auth-panel">
        <div className="vx-auth-kicker"><ShieldCheck size={14}/> AUTHORIZATION REQUIRED <span>0xA1</span></div>
        <h1>ACCESS<br/><em>CONTROL.</em></h1>
        <p className="vx-auth-copy">Enter a valid license key to initialize the VERSX performance environment.</p>
        <label>LICENSE KEY</label>
        <div className="vx-key-field"><span>&gt;</span><KeyRound size={15}/><input value={key} onChange={e => setKey(e.target.value.trim())} onKeyDown={e => e.key === 'Enter' && !isLoading && handleSubmit()} placeholder="XXXX-XXXX-XXXX-XXXX" autoFocus/><b>⌁</b></div>
        <button className="vx-auth-submit" onClick={handleSubmit} disabled={isLoading}>{isLoading ? <><LoaderCircle size={15} className="spin"/> VERIFYING LICENSE...</> : <>INITIALIZE SESSION <ArrowRight size={15}/></>}</button>
        <div className="vx-auth-options"><button onClick={() => setRemember(!remember)}><span className={remember ? 'checked' : ''}>{remember ? '✓' : ''}</span> REMEMBER LICENSE</button><button onClick={() => addToast({ type: 'info', title: 'Support', message: 'Join our Discord for support and key purchases.'})}><ExternalLink size={12}/> SUPPORT / PURCHASE</button></div>
      </div>
      <div className="vx-auth-footer"><span>KEYAUTH VERIFIED AUTHENTICATION</span><span>VERSX CORE // v1.0</span><span>© 2026</span></div>
    </div>
  </main>;
}
