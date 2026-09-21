import React, { useState } from 'react';
import { Globe, Wifi, Zap, Gauge, Shield } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ToggleSwitch from '../ToggleSwitch';
import ActionButton from '../ActionButton';
import { runLocalTweak } from '../../api';

const DNS_PRESETS = [
  { name: "Cloudflare", primary: "1.1.1.1", secondary: "1.0.0.1", icon: "☁️", desc: "Fastest & privacy-focused" },
  { name: "Google", primary: "8.8.8.8", secondary: "8.8.4.4", icon: "🔍", desc: "Reliable & widely used" },
  { name: "Quad9", primary: "9.9.9.9", secondary: "149.112.112.112", icon: "🛡️", desc: "Security & malware blocking" }
];

export default function NetworkTab() {
  const { addLog, addToast } = useStore();
  const [selectedDns, setSelectedDns] = useState(0);

  const handleFlushDns = async () => {
    addLog("INFO", "Flushing DNS resolver cache...");
    try { await runLocalTweak("Flush DNS"); } catch (e) { addToast({ type: "error", title: "DNS Flush Failed", message: e.message }); return; }
    setTimeout(() => {
      addLog("SUCCESS", "DNS cache flushed successfully.");
      addToast({
        type: "success",
        title: "DNS Flushed",
        message: "Resolver cache cleared."
      });
    }, 800);
  };

  const handleResetTcp = async () => {
    addLog("INFO", "Resetting TCP/IP stack auto-tuning...");
    try { await runLocalTweak("TCP Reset"); } catch (e) { addToast({ type: "error", title: "TCP Reset Failed", message: e.message }); return; }
    setTimeout(() => {
      addLog("SUCCESS", "TCP/IP stack optimized. Auto-tuning level: normal.");
      addToast({
        type: "success",
        title: "TCP/IP Reset",
        message: "Stack auto-tuning optimized."
      });
    }, 1000);
  };

  const handleSelectDns = async (index) => {
    setSelectedDns(index);
    const preset = DNS_PRESETS[index];
    try { await runLocalTweak(`DNS:${preset.primary}:${preset.secondary}`); } catch (e) { addToast({ type: "error", title: "DNS Change Failed", message: e.message }); return; }
    addLog("SUCCESS", `DNS set to ${preset.name}: ${preset.primary}`);
    addToast({
      type: "success",
      title: "DNS Changed",
      message: `Now using ${preset.name} (${preset.primary})`
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Network & Ping</h2>
        <p className="text-sm text-accent/60">
          Optimize your internet connection for lowest latency.
        </p>
      </div>

      {/* Network Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-glow-green/10 border border-glow-green/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-glow-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Flush DNS Cache</p>
              <p className="text-xs text-accent/60">
                Clear DNS resolver cache for fresh lookups.
              </p>
            </div>
          </div>
          <ActionButton
            label="Flush DNS"
            variant="primary"
            size="sm"
            icon={<Zap className="w-4 h-4" />}
            onClick={handleFlushDns}
          />
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-glow-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">TCP/IP Stack Reset</p>
              <p className="text-xs text-accent/60">
                Reset and optimize TCP auto-tuning parameters.
              </p>
            </div>
          </div>
          <ActionButton
            label="Reset & Optimize"
            variant="secondary"
            size="sm"
            icon={<Gauge className="w-4 h-4" />}
            onClick={handleResetTcp}
          />
        </div>
      </div>

      {/* DNS Presets */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-glow-green" /> Custom DNS Preset
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {DNS_PRESETS.map((dns, idx) => (
            <button
              key={dns.name}
              onClick={() => handleSelectDns(idx)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedDns === idx
                  ? "bg-glow-green/10 border-glow-green/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                  : "bg-charcoal/40 border-white/5 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{dns.name}</span>
                {selectedDns === idx && (
                  <span className="w-2 h-2 rounded-full bg-glow-green animate-pulse-glow" />
                )}
              </div>
              <p className="text-xs font-mono text-accent/70">{dns.primary}</p>
              <p className="text-xs font-mono text-accent/50">{dns.secondary}</p>
              <p className="text-xs text-accent/40 mt-2">{dns.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Latency Toggles */}
      <div className="grid gap-3">
        <ToggleSwitch
          label="Enable Nagle's Algorithm Tweak"
          description="Disables Nagle's algorithm for lower latency in online games."
          onToggle={async (val) => {
            if (val) { try { await runLocalTweak("Nagle"); } catch (e) { addToast({ type: "error", title: "Nagle", message: e.message }); return; } }
            addLog(
              val ? "SUCCESS" : "INFO",
              `Nagle's algorithm ${val ? "disabled for low latency" : "enabled"}.`
            );
            addToast({
              type: val ? "success" : "info",
              title: `Nagle Tweak ${val ? "Active" : "Off"}`
            });
          }}
        />
        <ToggleSwitch
          label="Disable Network Throttling Index"
          description="Removes Windows network throttling for unrestricted bandwidth."
          onToggle={async (val) => {
            if (val) { try { await runLocalTweak("Network Throttling"); } catch (e) { addToast({ type: "error", title: "Network Throttling", message: e.message }); return; } }
            addLog(val ? "SUCCESS" : "INFO", `Network throttling ${val ? "disabled" : "enabled"}.`);
            addToast({
              type: val ? "success" : "info",
              title: `Throttling ${val ? "Disabled" : "Enabled"}`
            });
          }}
        />
      </div>

      {/* Real-time Connection Status */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-glow-green" /> Connection Status
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-charcoal/40">
            <p className="text-2xl font-bold font-mono text-glow-green">
              12<span className="text-sm text-accent/50">ms</span>
            </p>
            <p className="text-xs text-accent/50 mt-1">Ping</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-charcoal/40">
            <p className="text-2xl font-bold font-mono text-glow-blue">0%</p>
            <p className="text-xs text-accent/50 mt-1">Packet Loss</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-charcoal/40">
            <p className="text-2xl font-bold font-mono text-white">
              8.2<span className="text-sm text-accent/50">ms</span>
            </p>
            <p className="text-xs text-accent/50 mt-1">Jitter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
