import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const LEVEL_COLORS = {
  SYSTEM: "text-glow-blue",
  SUCCESS: "text-glow-green",
  WARNING: "text-yellow-400",
  ERROR: "text-glow-red",
  INFO: "text-accent"
};

export default function ConsoleLogs() {
  const { logs, clearLogs } = useStore();
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-charcoal/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-glow-green" />
          <span className="text-xs font-mono text-accent uppercase tracking-wider">
            System Console
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-glow-green animate-pulse-glow" />
        </div>
        <button
          onClick={clearLogs}
          className="text-accent/40 hover:text-glow-red transition-colors p-1 rounded hover:bg-glow-red/10"
          title="Clear logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 bg-matte/50"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 animate-fade-in">
            <span className="text-accent/40 shrink-0">[{log.timestamp}]</span>
            <span className={`shrink-0 font-semibold ${LEVEL_COLORS[log.level] || 'text-white'}`}>
              [{log.level}]
            </span>
            <span className="text-white/80">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
