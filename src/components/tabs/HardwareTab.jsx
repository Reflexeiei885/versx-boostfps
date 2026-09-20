import React, { useState } from 'react';
import { Cpu, Microchip, MemoryStick, Timer, Power, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ActionButton from '../ActionButton';
import ToggleSwitch from '../ToggleSwitch';

const GPU_POWER_MODES = [
  "Prefer Maximum Performance",
  "Optimal Power",
  "Adaptive"
];

export default function HardwareTab() {
  const { addLog, addToast, specs } = useStore();
  const [selectedPowerMode, setSelectedPowerMode] = useState(0);

  const hardwareStats = [
    { label: "CPU Cores", value: specs.cores },
    { label: "CPU Clock", value: specs.clock },
    { label: "GPU VRAM", value: specs.vram },
    { label: "RAM Speed", value: specs.ramSpeed }
  ];

  const handleRamClean = () => {
    addLog("INFO", "Initiating RAM cleanup...");
    addLog("INFO", "Defragmenting memory blocks...");
    setTimeout(() => {
      addLog("SUCCESS", "RAM cleanup complete. Freed 1.8 GB.");
      addToast({
        type: "success",
        title: "RAM Cleaned",
        message: "Freed 1.8 GB of fragmented memory."
      });
    }, 1200);
  };

  const handleTimerResolution = () => {
    addLog("SUCCESS", "Timer resolution set to 0.5ms for lowest input lag.");
    addToast({
      type: "success",
      title: "Timer Optimized",
      message: "Resolution set to 0.5ms."
    });
  };

  const handleSelectPowerMode = (mode, index) => {
    setSelectedPowerMode(index);
    addLog("SUCCESS", `GPU power mode: ${mode}.`);
    addToast({
      type: "success",
      title: "GPU Mode Set",
      message: mode
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-glow-green" /> Hardware & GPU
        </h2>
        <p className="text-sm text-accent/60">
          Low-level hardware optimizations for maximum performance.
        </p>
      </div>

      {/* GPU Power Profile */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-glow-green/10 border border-glow-green/20 flex items-center justify-center">
            <Microchip className="w-5 h-5 text-glow-green" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">GPU Power Management</p>
            <p className="text-xs text-accent/60">
              Configure NVIDIA/AMD power profile.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {GPU_POWER_MODES.map((mode, idx) => (
            <button
              key={mode}
              onClick={() => handleSelectPowerMode(mode, idx)}
              className={`p-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${
                selectedPowerMode === idx
                  ? "bg-glow-green/10 border-glow-green/30 text-glow-green"
                  : "bg-charcoal/40 border-white/5 text-accent hover:border-white/15 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* RAM Cleaner */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center">
              <MemoryStick className="w-5 h-5 text-glow-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                RAM Cleaner / Memory Defrag
              </p>
              <p className="text-xs text-accent/60">
                Force-clean standby memory and defrag allocations.
              </p>
            </div>
          </div>
          <ActionButton
            label="Clean RAM"
            variant="primary"
            size="sm"
            icon={<MemoryStick className="w-4 h-4" />}
            onClick={handleRamClean}
          />
        </div>
      </div>

      {/* Timer Resolution Switcher */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-glow-green/10 border border-glow-green/20 flex items-center justify-center">
              <Timer className="w-5 h-5 text-glow-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Timer Resolution Switcher
              </p>
              <p className="text-xs text-accent/60">
                Set system timer to 0.5ms for lowest input latency.
              </p>
            </div>
          </div>
          <ActionButton
            label="Set 0.5ms"
            variant="primary"
            size="sm"
            icon={<Zap className="w-4 h-4" />}
            onClick={handleTimerResolution}
          />
        </div>
      </div>

      {/* Hardware Toggles */}
      <div className="grid gap-3">
        <ToggleSwitch
          label="Disable CPU Core Parking"
          description="Keeps all CPU cores active to prevent parking-related latency spikes."
          defaultOn={true}
          onToggle={(val) => {
            addLog(val ? "SUCCESS" : "INFO", `CPU core parking ${val ? "disabled" : "enabled"}.`);
            addToast({
              type: val ? "success" : "info",
              title: `Core Parking ${val ? "Disabled" : "Enabled"}`
            });
          }}
        />
        <ToggleSwitch
          label="Disable GPU Power Saving"
          description="Prevents the GPU from downclocking during low-load moments."
          onToggle={(val) => {
            addLog(val ? "SUCCESS" : "INFO", `GPU power saving ${val ? "disabled" : "enabled"}.`);
            addToast({
              type: val ? "success" : "info",
              title: `GPU Power Saving ${val ? "Off" : "On"}`
            });
          }}
        />
        <ToggleSwitch
          label="Enable Hardware-Accelerated GPU Scheduling"
          description="Reduces latency by letting the GPU manage its own memory scheduling."
          defaultOn={true}
          onToggle={(val) => {
            addLog(val ? "SUCCESS" : "INFO", `HAGS ${val ? "enabled" : "disabled"}.`);
            addToast({
              type: val ? "success" : "info",
              title: `HAGS ${val ? "Enabled" : "Disabled"}`
            });
          }}
        />
      </div>

      {/* Hardware Status Grid */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Power className="w-4 h-4 text-glow-green" /> Hardware Status
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {hardwareStats.map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-lg bg-charcoal/40 border border-white/5"
            >
              <p className="text-xs text-accent/50 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-sm font-mono text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
