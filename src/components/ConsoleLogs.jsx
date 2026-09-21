import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
const LEVEL_COLORS = { SYSTEM: 'system', SUCCESS: 'success', WARNING: 'warning', ERROR: 'error', INFO: 'info' };
export default function ConsoleLogs() {
  const { logs, clearLogs } = useStore();
  const consoleRef = useRef(null);
  useEffect(() => { if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight; }, [logs]);
  return <section className="vx-console">
    <div className="vx-console-head"><div><Terminal size={14}/><span>LIVE CONSOLE</span><i/></div><button onClick={clearLogs} title="Clear logs"><Trash2 size={13}/></button></div>
    <div ref={consoleRef} className="vx-console-body">
      {logs.map(log => <div key={log.id} className="vx-log"><span className="vx-time">{log.timestamp}</span><b className={LEVEL_COLORS[log.level] || 'info'}>{log.level}</b><span>{log.message}</span></div>)}
    </div>
  </section>;
}
