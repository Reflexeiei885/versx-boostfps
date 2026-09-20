import React, { useState, useEffect } from 'react';

export default function ToggleSwitch({
  label,
  description,
  defaultOn = false,
  onToggle
}) {
  const storageKey = `tweak_${label}`;

  const [isOn, setIsOn] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
      return saved === "true";
    }
    return defaultOn;
  });

  const handleToggle = () => {
    const nextState = !isOn;
    setIsOn(nextState);
    localStorage.setItem(storageKey, String(nextState));
    onToggle?.(nextState);
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-charcoal/50 border border-white/5 hover:border-white/10 transition-all duration-200 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && (
          <p className="text-xs text-accent/70 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative w-12 h-6 rounded-full toggle-switch shrink-0 ${
          isOn ? "bg-glow-green/30" : "bg-slate"
        }`}
        role="switch"
        aria-checked={isOn}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full toggle-switch ${
            isOn
              ? "translate-x-6 bg-glow-green shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              : "bg-accent/50"
          }`}
        />
      </button>
    </div>
  );
}
