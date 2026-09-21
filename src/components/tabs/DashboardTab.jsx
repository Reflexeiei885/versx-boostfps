import React, { useEffect, useMemo, useState } from 'react';
import { Zap, Activity, Cpu, MemoryStick, Microchip, HardDrive, Monitor, Thermometer, Wifi, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { applyAllTweaks, getMetrics, getBridgeHealth, runLocalTweak } from '../../api';
import ActionButton from '../ActionButton';
import PerformanceGraph from '../PerformanceGraph';

const MAX_POINTS = 36;
const seed = (value = 0) => Array.from({ length: MAX_POINTS }, () => value);

export default function DashboardTab() {
  const { addLog, addToast, specs } = useStore();
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, gpu: 0, disk: 0 });
  const [samples, setSamples] = useState({ cpu: seed(), ram: seed(), gpu: seed(), disk: seed() });
  const [bridgeOnline, setBridgeOnline] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const [health, result] = await Promise.all([getBridgeHealth(), getMetrics()]);
        if (!alive) return;
        setBridgeOnline(Boolean(health?.success));
        const m = result?.data || {};
        setMetrics({ cpu: Number(m.cpu) || 0, ram: Number(m.ram) || 0, gpu: Number(m.gpu) || 0, disk: Number(m.disk) || 0 });
        setSamples((prev) => ({
          cpu: [...prev.cpu.slice(-(MAX_POINTS - 1)), Number(m.cpu) || 0],
          ram: [...prev.ram.slice(-(MAX_POINTS - 1)), Number(m.ram) || 0],
          gpu: [...prev.gpu.slice(-(MAX_POINTS - 1)), Number(m.gpu) || 0],
          disk: [...prev.disk.slice(-(MAX_POINTS - 1)), Number(m.disk) || 0]
        }));
      } catch {
        if (alive) setBridgeOnline(false);
      }
    };
    poll();
    const timer = setInterval(poll, 1000);
    return () => { alive = false; clearInterval(timer); };
  }, []);

  const graphSeries = useMemo(() => ({
    cpu: { values: samples.cpu, className: 'cpu' },
    ram: { values: samples.ram, className: 'ram' },
    gpu: { values: samples.gpu, className: 'gpu' },
    disk: { values: samples.disk, className: 'disk' }
  }), [samples]);

  const handleBoost = async () => {
    setIsBoosting(true);
    addLog('SYSTEM', 'Starting REAL BOOST FPS sequence...');
    try {
      const result = await applyAllTweaks();
      const output = result?.data?.output || '';
      output.split(/\r?\n/).filter(Boolean).slice(-40).forEach((line) => {
        const level = line.includes('[SUCCESS]') ? 'SUCCESS' : line.includes('[WARNING]') ? 'WARNING' : 'INFO';
        addLog(level, line.replace(/^\[[^\]]+\]\s*\[[^\]]+\]\s*/, ''));
      });
      addLog('SUCCESS', 'BOOST FPS completed. Windows tweaks were executed by the local bridge.');
      addToast({ type: 'success', title: 'Boost Applied', message: 'Real Windows optimizations completed.' });
    } catch (e) {
      addLog('ERROR', `BOOST FPS failed: ${e.message}`);
      addToast({ type: 'error', title: 'Boost Failed', message: e.message });
    } finally {
      setIsBoosting(false);
    }
  };

  const infoList = [
    { label: 'Operating System', value: specs.os, icon: <Monitor className="w-4 h-4" /> },
    { label: 'Processor', value: specs.cpu, icon: <Cpu className="w-4 h-4" /> },
    { label: 'Graphics', value: specs.gpu, icon: <Microchip className="w-4 h-4" /> },
    { label: 'Memory', value: specs.ramTotal, icon: <MemoryStick className="w-4 h-4" /> },
    { label: 'Display', value: specs.resolution, icon: <Monitor className="w-4 h-4" /> },
    { label: 'Bridge', value: bridgeOnline ? 'LOCAL BRIDGE ONLINE' : 'LOCAL BRIDGE OFFLINE', icon: bridgeOnline ? <ShieldCheck className="w-4 h-4" /> : <Wifi className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-glow-green/5 to-transparent" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1"><span className={`vx-status-dot ${bridgeOnline ? 'online' : ''}`} /><h2 className="text-xl font-bold text-white">Quick Boost</h2></div>
            <p className="text-sm text-accent/70">One-click optimization that executes the configured Windows/FiveM tweaks through the local bridge.</p>
          </div>
          <button onClick={handleBoost} disabled={isBoosting} className={`px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all duration-300 flex items-center gap-3 ${isBoosting ? 'bg-glow-green/10 border border-glow-green/20 text-glow-green/50 cursor-wait' : 'bg-glow-green/15 border border-glow-green/30 text-glow-green hover:bg-glow-green/25 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105 animate-boost-pulse'}`}>
            <Zap className={`w-6 h-6 ${isBoosting ? 'animate-spin-slow' : ''}`} />{isBoosting ? 'BOOSTING...' : 'BOOST NOW'}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-accent uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4" /> Live System Performance</h3>
          <span className={`text-xs font-mono ${bridgeOnline ? 'text-glow-green' : 'text-accent/50'}`}>{bridgeOnline ? 'LIVE // 1s' : 'BRIDGE OFFLINE'}</span>
        </div>
        <div className="glass rounded-xl p-4">
          <PerformanceGraph series={graphSeries} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {[
              ['CPU', metrics.cpu, 'cpu'], ['RAM', metrics.ram, 'ram'], ['GPU', metrics.gpu, 'gpu'], ['DISK', metrics.disk, 'disk']
            ].map(([label, value, cls]) => <div key={label} className="vx-metric-chip"><span className={`vx-metric-dot ${cls}`} /><div><b>{label}</b><strong>{Math.round(value)}%</strong></div></div>)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-accent uppercase tracking-wider mb-3 flex items-center gap-2"><Monitor className="w-4 h-4" /> System Information</h3>
        <div className="glass rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoList.map((item) => <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-charcoal/40 border border-white/5"><span className="text-glow-green/60">{item.icon}</span><div className="min-w-0"><p className="text-xs text-accent/50 uppercase tracking-wider">{item.label}</p><p className={`text-sm truncate ${item.label === 'Bridge' && !bridgeOnline ? 'text-accent/60' : 'text-white'}`}>{item.value}</p></div></div>)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-accent uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <ActionButton label="Clear RAM" variant="primary" size="sm" icon={<MemoryStick className="w-4 h-4" />} onClick={async () => { try { await runLocalTweak('Clean RAM'); addToast({type:'success',title:'RAM Cleanup',message:'Real cleanup request completed.'}); addLog('SUCCESS','RAM cleanup executed.'); } catch(e){addToast({type:'error',title:'RAM Cleanup',message:e.message});} }} />
          <ActionButton label="Flush DNS" variant="secondary" size="sm" icon={<Activity className="w-4 h-4" />} onClick={async () => { try { await runLocalTweak('Flush DNS'); addToast({type:'success',title:'DNS Flushed'}); addLog('SUCCESS','DNS resolver cache flushed.'); } catch(e){addToast({type:'error',title:'DNS Flush',message:e.message});} }} />
          <ActionButton label="Temp Cleanup" variant="secondary" size="sm" icon={<HardDrive className="w-4 h-4" />} onClick={async () => { try { await runLocalTweak('Temp Cleanup'); addToast({type:'success',title:'Temp Files Cleared'}); addLog('SUCCESS','Temporary files cleanup executed.'); } catch(e){addToast({type:'error',title:'Temp Cleanup',message:e.message});} }} />
        </div>
      </div>
    </div>
  );
}
