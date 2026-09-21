import React, { useState, useEffect } from 'react';

const COLOR_MAP = {
  green: {
    text: "text-glow-green",
    bg: "bg-glow-green",
    shadow: "shadow-[0_0_10px_rgba(34,197,94,0.4)]",
    ring: "text-glow-green/20"
  },
  blue: {
    text: "text-glow-blue",
    bg: "bg-glow-blue",
    shadow: "shadow-[0_0_10px_rgba(59,130,246,0.4)]",
    ring: "text-glow-blue/20"
  },
  red: {
    text: "text-glow-red",
    bg: "bg-glow-red",
    shadow: "shadow-[0_0_10px_rgba(239,68,68,0.4)]",
    ring: "text-glow-red/20"
  },
  yellow: {
    text: "text-yellow-400",
    bg: "bg-yellow-400",
    shadow: "shadow-[0_0_10px_rgba(250,204,21,0.4)]",
    ring: "text-yellow-400/20"
  }
};

export default function CircularGauge({
  label,
  value,
  max = 100,
  unit = "%",
  icon,
  subValue,
  color = "green"
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const theme = COLOR_MAP[color] || COLOR_MAP.green;
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const target = value;
    const start = displayValue;
    const duration = 600;
    const startTime = performance.now();
    let frameId;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (target - start) * ease));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass rounded-xl p-5 flex flex-col items-center gap-3 hover:border-white/10 transition-all duration-200 group">
      <div className="flex items-center gap-2 self-start">
        {icon && <span className={theme.text}>{icon}</span>}
        <span className="text-xs font-medium text-accent uppercase tracking-wider">{label}</span>
      </div>

      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate"
            opacity="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${theme.text} transition-all duration-700 ease-out`}
            style={{ filter: "drop-shadow(0 0 4px currentColor)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold font-mono ${theme.text}`}>
            {displayValue}{unit}
          </span>
          {subValue && (
            <span className="text-xs text-accent/60 mt-0.5">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  );
}
