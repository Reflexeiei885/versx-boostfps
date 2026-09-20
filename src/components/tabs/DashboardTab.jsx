import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Cpu,
  MemoryStick,
  Microchip,
  HardDrive,
  Monitor,
  Thermometer
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import CircularGauge from '../CircularGauge';
import ActionButton from '../ActionButton';

export default function DashboardTab() {
  const { addLog, addToast, specs } = useStore();

  const ramTotalNum = specs.ramTotalNum || 16;
  const [metrics, setMetrics] = useState({
    cpu: 34,
    cpuTemp: 52,
    ramUsed: 8.2,
    ramTotal: ramTotalNum,
    gpu: 28,
    disk: 12
  });

  const [isBoosting, setIsBoosting] = useState(false);

  // Dynamic simulation of hardware stats
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.5) * 15)),
        cpuTemp: Math.max(35, Math.min(85, prev.cpuTemp + (Math.random() - 0.5) * 5)),
        ramUsed: Math.max(4, Math.min(ramTotalNum - 1, prev.ramUsed + (Math.random() - 0.5) * 0.5)),
        ramTotal: ramTotalNum,
        gpu: Math.max(5, Math.min(95, prev.gpu + (Math.random() - 0.5) * 12)),
        disk: Math.max(2, Math.min(80, prev.disk + (Math.random() - 0.5) * 10))
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, [ramTotalNum]);

  const handleBoost = () => {
    setIsBoosting(true);
    addLog("SYSTEM", "Initiating BOOST NOW sequence...");

    const steps = [
      "Clearing standby memory...",
      "Disabling non-essential services...",
      "Optimizing CPU core scheduling...",
      "Flushing DNS cache...",
      "Applying GPU power profile..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => addLog("INFO", step), idx * 400);
    });

    setTimeout(() => {
      addLog("SUCCESS", "Boost complete. System optimized for maximum FPS.");
      addToast({
        type: "success",
        title: "Boost Applied",
        message: "All optimizations applied successfully!"
      });
      setIsBoosting(false);
    }, steps.length * 400 + 300);
  };

  const ramPercentage = (metrics.ramUsed / ramTotalNum) * 100;

  const infoList = [
    { label: "Operating System", value: specs.os, icon: <Monitor className="w-4 h-4" /> },
    { label: "Processor", value: specs.cpu, icon: <Cpu className="w-4 h-4" /> },
    { label: "Graphics", value: specs.gpu, icon: <Microchip className="w-4 h-4" /> },
    { label: "Memory", value: specs.ramTotal, icon: <MemoryStick className="w-4 h-4" /> },
    { label: "Display", value: specs.resolution, icon: <Monitor className="w-4 h-4" /> },
    { label: "Temperature", value: `${Math.round(metrics.cpuTemp)}°C (CPU)`, icon: <Thermometer className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Boost Banner */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-glow-green/5 to-transparent" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Quick Boost</h2>
            <p className="text-sm text-accent/70">
              One-click optimization for maximum gaming performance.
            </p>
          </div>
          <button
            onClick={handleBoost}
            disabled={isBoosting}
            className={`px-8 py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all duration-300 flex items-center gap-3 ${
              isBoosting
                ? "bg-glow-green/10 border border-glow-green/20 text-glow-green/50 cursor-wait"
                : "bg-glow-green/15 border border-glow-green/30 text-glow-green hover:bg-glow-green/25 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-105 animate-boost-pulse"
            }`}
          >
            <Zap className={`w-6 h-6 ${isBoosting ? "animate-spin-slow" : ""}`} />
            {isBoosting ? "BOOSTING..." : "BOOST NOW"}
          </button>
        </div>
      </div>

      {/* Live System Monitor Gauges */}
      <div>
        <h3 className="text-sm font-medium text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Live System Monitor
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CircularGauge
            label="CPU Usage"
            value={Math.round(metrics.cpu)}
            icon={<Cpu className="w-4 h-4" />}
            color="green"
            subValue={`${Math.round(metrics.cpuTemp)}°C`}
          />
          <CircularGauge
            label="RAM"
            value={Math.round(ramPercentage)}
            icon={<MemoryStick className="w-4 h-4" />}
            color="blue"
            subValue={`${metrics.ramUsed.toFixed(1)} / ${ramTotalNum}GB`}
          />
          <CircularGauge
            label="GPU"
            value={Math.round(metrics.gpu)}
            icon={<Microchip className="w-4 h-4" />}
            color="yellow"
            subValue={specs.gpuShort || "GPU"}
          />
          <CircularGauge
            label="Disk"
            value={Math.round(metrics.disk)}
            icon={<HardDrive className="w-4 h-4" />}
            color="red"
            subValue="SSD"
          />
        </div>
      </div>

      {/* System Information */}
      <div>
        <h3 className="text-sm font-medium text-accent uppercase tracking-wider mb-3 flex items-center gap-2">
          <Monitor className="w-4 h-4" /> System Information
        </h3>
        <div className="glass rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoList.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-charcoal/40 border border-white/5"
            >
              <span className="text-glow-green/60">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-xs text-accent/50 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-accent uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            label="Clear RAM"
            variant="primary"
            size="sm"
            icon={<MemoryStick className="w-4 h-4" />}
            onClick={() => {
              addToast({
                type: "success",
                title: "RAM Cleared",
                message: "Freed 1.2 GB of memory."
              });
              addLog("SUCCESS", "RAM clean: freed 1.2GB standby memory.");
            }}
          />
          <ActionButton
            label="Flush DNS"
            variant="secondary"
            size="sm"
            icon={<Activity className="w-4 h-4" />}
            onClick={() => {
              addToast({ type: "success", title: "DNS Flushed" });
              addLog("SUCCESS", "DNS resolver cache flushed.");
            }}
          />
          <ActionButton
            label="Temp Cleanup"
            variant="secondary"
            size="sm"
            icon={<HardDrive className="w-4 h-4" />}
            onClick={() => {
              addToast({
                type: "success",
                title: "Temp Files Cleared",
                message: "Removed 847 MB of temp files."
              });
              addLog("SUCCESS", "Cleared 847MB of temporary files.");
            }}
          />
        </div>
      </div>
    </div>
  );
}
