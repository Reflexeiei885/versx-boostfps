import React, { useState } from 'react';
import { Trash2, Layers, Eye, Power, Rocket } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ToggleSwitch from '../ToggleSwitch';
import ActionButton from '../ActionButton';
import { runLocalTweak } from '../../api';

export default function WindowsTweaksTab() {
  const { addLog, addToast } = useStore();
  const [cleanedMb, setCleanedMb] = useState(0);
  const [isCleaning, setIsCleaning] = useState(false);

  const handleCleanup = async () => {
    setIsCleaning(true);
    addLog("INFO", "Scanning temporary files and executing cleanup...");
    try {
      const result = await runLocalTweak("Temp Cleanup");
      const cleaned = Number(result?.data?.cleanedMb || 0);
      setCleanedMb(cleaned);
      setIsCleaning(false);
      addLog("SUCCESS", `Cleaned ${cleaned.toFixed(1)} MB of temporary files.`);
      addToast({ type: "success", title: "Cleanup Complete", message: `${cleaned.toFixed(1)} MB removed.` });
    } catch (e) {
      setIsCleaning(false);
      addToast({ type: "error", title: "Cleanup Failed", message: e.message });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Windows Tweaks</h2>
        <p className="text-sm text-accent/60">
          Real Windows optimization toggles and actions.
        </p>
      </div>

      {/* Main Optimization Toggles */}
      <div className="grid gap-3">
        <ToggleSwitch
          label="Disable Telemetry & Tracking"
          description="Stops Windows diagnostic data collection and tracking services."
          onToggle={async (val) => {
            try { await runLocalTweak(`Disable Telemetry:${val ? "on" : "off"}`); } catch (e) { addToast({ type: "error", title: "Telemetry", message: e.message }); return; }
            addLog(val ? "SUCCESS" : "INFO", `Telemetry services ${val ? "disabled" : "enabled"}.`);
            addToast({
              type: val ? "success" : "info",
              title: val ? "Telemetry Disabled" : "Telemetry Enabled"
            });
          }}
        />
        <ToggleSwitch
          label="Disable Game DVR & Background Recording"
          description="Turns off Xbox Game DVR to reduce overhead and increase FPS."
          defaultOn={true}
          onToggle={async (val) => {
            try { await runLocalTweak(`Game DVR:${val ? "on" : "off"}`); } catch (e) { addToast({ type: "error", title: "Game DVR", message: e.message }); return; }
            addLog(val ? "SUCCESS" : "INFO", `Game DVR ${val ? "disabled" : "enabled"}.`);
            addToast({
              type: val ? "success" : "info",
              title: `Game DVR ${val ? "Disabled" : "Enabled"}`
            });
          }}
        />
        <ToggleSwitch
          label="Enable Ultimate Performance Power Plan"
          description="Unlocks the hidden Ultimate Performance power plan for max throughput."
          onToggle={async (val) => {
            try { await runLocalTweak(`High Performance:${val ? "on" : "off"}`); } catch (e) { addToast({ type: "error", title: "Power Plan", message: e.message }); return; }
            addLog(val ? "SUCCESS" : "INFO", `Ultimate Performance Plan ${val ? "activated" : "deactivated"}.`);
            addToast({
              type: val ? "success" : "info",
              title: `Power Plan ${val ? "Optimized" : "Reverted"}`
            });
          }}
        />
        <ToggleSwitch
          label="Disable Visual Effects & Animations"
          description="Turns off Windows UI animations for snappier system response."
          onToggle={async (val) => {
            try {
              await runLocalTweak(`Visual Effects:${val ? "on" : "off"}`);
              addLog(val ? "SUCCESS" : "INFO", `Visual effects ${val ? "minimized" : "restored"}.`);
              addToast({ type: val ? "success" : "info", title: `Visual Effects ${val ? "Disabled" : "Enabled"}` });
            } catch (e) {
              addToast({ type: "error", title: "Visual Effects", message: e.message });
            }
          }}
        />
        <ToggleSwitch
          label="Optimize Startup Applications"
          description="Disables unnecessary startup programs to speed up boot time."
          defaultOn={true}
          onToggle={async (val) => {
            try {
              await runLocalTweak(`Startup:${val ? "off" : "on"}`);
              addLog(val ? "SUCCESS" : "INFO", `Startup apps ${val ? "optimized" : "restored"}.`);
              addToast({ type: val ? "success" : "info", title: `Startup ${val ? "Optimized" : "Reverted"}` });
            } catch (e) {
              addToast({ type: "error", title: "Startup Optimization", message: e.message });
            }
          }}
        />
      </div>

      {/* Temp Files Cleaner Card */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-glow-green/10 border border-glow-green/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-glow-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Clear Temporary Files & System Cache
              </p>
              <p className="text-xs text-accent/60">
                Removes temp files, prefetch, and Windows cache.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono text-glow-green">{cleanedMb}</p>
            <p className="text-xs text-accent/50">MB cleaned</p>
          </div>
        </div>
        <ActionButton
          label={isCleaning ? "Cleaning..." : "Run Cleanup"}
          variant="primary"
          icon={<Trash2 className="w-4 h-4" />}
          loading={isCleaning}
          onClick={handleCleanup}
        />
      </div>

      {/* Additional Quick Tweaks */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-3">Additional Tweaks</p>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            label="Disable Superfetch"
            variant="secondary"
            size="sm"
            icon={<Layers className="w-4 h-4" />}
            onClick={async () => {
              try { await runLocalTweak("Disable Superfetch"); } catch (e) { addToast({ type: "error", title: "Superfetch", message: e.message }); return; }
              addLog("SUCCESS", "Superfetch service disabled.");
              addToast({ type: "success", title: "Superfetch Disabled" });
            }}
          />
          <ActionButton
            label="Disable Windows Search"
            variant="secondary"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={async () => {
              try { await runLocalTweak("Disable Windows Search"); } catch (e) { addToast({ type: "error", title: "Windows Search", message: e.message }); return; }
              addLog("SUCCESS", "Windows Search indexing disabled.");
              addToast({ type: "success", title: "Search Indexing Disabled" });
            }}
          />
          <ActionButton
            label="Disable Print Spooler"
            variant="secondary"
            size="sm"
            icon={<Power className="w-4 h-4" />}
            onClick={async () => {
              try { await runLocalTweak("Disable Print Spooler"); } catch (e) { addToast({ type: "error", title: "Print Spooler", message: e.message }); return; }
              addLog("SUCCESS", "Print Spooler service disabled.");
              addToast({ type: "success", title: "Print Spooler Disabled" });
            }}
          />
          <ActionButton
            label="Game Mode ON"
            variant="primary"
            size="sm"
            icon={<Rocket className="w-4 h-4" />}
            onClick={async () => {
              try { await runLocalTweak("Game Mode"); } catch (e) { addToast({ type: "error", title: "Game Mode", message: e.message }); return; }
              addLog("SUCCESS", "Windows Game Mode enabled.");
              addToast({ type: "success", title: "Game Mode Enabled" });
            }}
          />
        </div>
      </div>
    </div>
  );
}
