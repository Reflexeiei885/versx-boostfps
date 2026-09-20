import React, { useState } from 'react';
import { Gamepad2, FolderTree, FileText, Rocket, Monitor } from 'lucide-react';
import { useStore } from '../../store/useStore';
import SliderControl from '../SliderControl';
import ActionButton from '../ActionButton';
import ToggleSwitch from '../ToggleSwitch';

const GRAPHICS_PROFILES = [
  { name: "Ultra Performance", desc: "Lowest settings, highest FPS", color: "green" },
  { name: "Balanced", desc: "Good visuals, stable FPS", color: "blue" },
  { name: "Quality", desc: "Best visuals, lower FPS", color: "yellow" }
];

export default function FiveMTab() {
  const { addLog, addToast } = useStore();
  const [textureBudget, setTextureBudget] = useState(2048);
  const [selectedProfile, setSelectedProfile] = useState(0);

  const handleClearCache = () => {
    addLog("INFO", "Clearing FiveM cache...");
    addLog("INFO", "Removing NUI Storage cache...");
    addLog("INFO", "Removing crash logs...");
    setTimeout(() => {
      addLog("SUCCESS", "FiveM cache cleared. Freed 342 MB.");
      addToast({
        type: "success",
        title: "Cache Cleared",
        message: "NUI storage & crash logs removed (342 MB)."
      });
    }, 800);
  };

  const handleSetPriority = () => {
    addLog("SUCCESS", "FiveM process priority set to HIGH.");
    addToast({
      type: "success",
      title: "Priority Boosted",
      message: "FiveM set to High priority."
    });
  };

  const handleProfileSelect = (index) => {
    setSelectedProfile(index);
    const profile = GRAPHICS_PROFILES[index];
    addLog("SUCCESS", `Graphics profile: ${profile.name}.`);
    addToast({
      type: "success",
      title: "Preset Applied",
      message: `${profile.name} profile active.`
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-glow-green" /> FiveM Optimization
        </h2>
        <p className="text-sm text-accent/60">
          Dedicated tweaks for FiveM / GTA V multiplayer performance.
        </p>
      </div>

      {/* Clear FiveM Cache */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-glow-green/10 border border-glow-green/20 flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-glow-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Clear FiveM Cache</p>
              <p className="text-xs text-accent/60">
                NUI Storage, crash logs, and resource cache.
              </p>
            </div>
          </div>
          <ActionButton
            label="Clear Cache"
            variant="primary"
            size="sm"
            icon={<FolderTree className="w-4 h-4" />}
            onClick={handleClearCache}
          />
        </div>
      </div>

      {/* citizenFX.ini Settings */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-glow-green" />
          <p className="text-sm font-medium text-white">citizenFX.ini Settings</p>
        </div>
        <SliderControl
          label="Texture Budget"
          value={textureBudget}
          min={512}
          max={8192}
          unit="MB"
          step={256}
          onChange={(val) => {
            setTextureBudget(val);
            addLog("INFO", `Texture budget adjusted to ${val}MB.`);
          }}
          description="Controls how much VRAM FiveM uses for textures. Higher = better textures but more VRAM."
        />
      </div>

      {/* Priority Booster */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-glow-blue/10 border border-glow-blue/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-glow-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Priority Booster</p>
              <p className="text-xs text-accent/60">
                Set FiveM process priority to High for better CPU allocation.
              </p>
            </div>
          </div>
          <ActionButton
            label="Set High Priority"
            variant="primary"
            size="sm"
            icon={<Rocket className="w-4 h-4" />}
            onClick={handleSetPriority}
          />
        </div>
      </div>

      {/* Graphics Presets */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Monitor className="w-4 h-4 text-glow-green" /> High-Performance Graphics Profile
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {GRAPHICS_PROFILES.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => handleProfileSelect(idx)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                selectedProfile === idx
                  ? "bg-glow-green/10 border-glow-green/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                  : "bg-charcoal/40 border-white/5 hover:border-white/15"
              }`}
            >
              <p className="text-sm font-medium text-white mb-1">{p.name}</p>
              <p className="text-xs text-accent/50">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Background Apps Toggle */}
      <ToggleSwitch
        label="Disable Background Apps During FiveM"
        description="Closes non-essential background apps when FiveM is running to free resources."
        defaultOn={true}
        onToggle={(val) => {
          addLog(
            val ? "SUCCESS" : "INFO",
            `Background app management ${val ? "enabled" : "disabled"}.`
          );
          addToast({
            type: val ? "success" : "info",
            title: `Background Apps ${val ? "Managed" : "Unmanaged"}`
          });
        }}
      />
    </div>
  );
}
