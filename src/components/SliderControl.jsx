import React from 'react';

export default function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  description
}) {
  return (
    <div className="p-4 rounded-xl bg-charcoal/50 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-medium text-white">{label}</span>
          {description && (
            <p className="text-xs text-accent/60 mt-0.5">{description}</p>
          )}
        </div>
        <span className="text-sm font-mono text-glow-green bg-glow-green/10 px-2 py-0.5 rounded-md">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="slider-track w-full"
      />
    </div>
  );
}
