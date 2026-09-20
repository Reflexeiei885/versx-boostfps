import React, { useState, useEffect } from 'react';

const VARIANTS = {
  primary: "bg-glow-green/15 border-glow-green/30 text-glow-green hover:bg-glow-green/25 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]",
  secondary: "bg-slate/60 border-white/10 text-white hover:bg-slateLight hover:border-white/20",
  danger: "bg-glow-red/15 border-glow-red/30 text-glow-red hover:bg-glow-red/25 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
  ghost: "bg-transparent border-transparent text-accent hover:text-white hover:bg-white/5"
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base"
};

export default function ActionButton({
  label,
  icon,
  onClick,
  variant = "secondary",
  size = "md",
  disabled = false,
  loading = false,
  className = ""
}) {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 600);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  return (
    <button
      onClick={() => {
        if (!disabled && !loading) {
          setClicked(true);
          onClick?.();
        }
      }}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-lg border font-medium
        transition-all duration-200 active:scale-95
        ${VARIANTS[variant]} ${SIZES[size]}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${clicked ? "scale-95" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );
}
