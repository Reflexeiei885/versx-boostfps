import React, { useState } from 'react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const { addLog, addToast, specs } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    addLog("WARNING", "Resetting all tweaks to default configuration...");
    addToast({
      type: "warning",
      title: "Reset Complete",
      message: "All tweaks reverted to default."
    });
    setShowConfirm(false);
    setTimeout(() => {
      addLog("SUCCESS", "System restored to default state.");
    }, 800);
  };

  return (
    <>
      <header className="h-16 shrink-0 glass-strong border-b border-white/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Boost FPS Ghet v1.0
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-glow-green animate-pulse-glow" />
              <span className="text-xs font-mono text-accent">Status: Active</span>
            </div>
              <span className="text-accent/20">|</span>
              <span className="text-xs font-mono text-accent">{specs.osShort || "System: Windows"}</span>
          </div>
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-glow-red/20 text-glow-red/80 hover:text-glow-red hover:bg-glow-red/10 hover:border-glow-red/40 text-sm font-medium transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">RESET ALL TO DEFAULT</span>
        </button>
      </header>

      {/* Reset Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full animate-slide-up glow-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-glow-red/10 border border-glow-red/20 flex items-center justify-center shrink-0">
                <TriangleAlert className="w-6 h-6 text-glow-red" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">
                  Reset All Tweaks?
                </h3>
                <p className="text-sm text-accent/70">
                  This will revert all optimizations, toggles, and settings back to their default Windows values. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-accent hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg bg-glow-red/15 border border-glow-red/30 text-glow-red hover:bg-glow-red/25 text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
