import React, { useState, useEffect } from 'react';
import { Shield, Key, LoaderCircle, Lock, MessageCircle, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AuthModal() {
  const { loginKeyAuth, initKeyAuth, addToast } = useStore();
  const [key, setKey] = useState("");
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initKeyAuth();
    const saved = localStorage.getItem("saved_license_key");
    if (saved) {
      setKey(saved);
    }
  }, [initKeyAuth]);

  const handleSubmit = async () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      addToast({
        type: "error",
        title: "Invalid Key",
        message: "Please enter a license key."
      });
      return;
    }

    setIsLoading(true);
    const result = await loginKeyAuth(trimmedKey);
    setIsLoading(false);

    if (result.success) {
      if (remember) {
        localStorage.setItem("saved_license_key", trimmedKey);
      } else {
        localStorage.removeItem("saved_license_key");
      }
    }
  };

  return (
    <div className="min-h-screen bg-matte bg-grid bg-noise flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-glow-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glow-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-strong mb-4 glow-border">
            <Zap className="w-8 h-8 text-glow-green" />
          </div>
          <h1 className="text-3xl font-bold text-gradient tracking-tight">
            VERSX
          </h1>
          <div className="inline-flex items-center gap-2 mt-3">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-glow-green/10 border border-glow-green/30 text-glow-green flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-glow-green animate-pulse-glow" />
              v1.0 ONLINE
            </span>
          </div>
        </div>

        {/* Auth Box */}
        <div className="glass-strong rounded-2xl p-8 glow-border scanline-overlay">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Secure Authentication</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-accent/70 uppercase tracking-wider mb-2 block">
                License Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/40" />
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.trim())}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSubmit()}
                  placeholder="Enter your VERSX license key"
                  className="w-full bg-matte/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm font-mono text-white placeholder-accent/30 focus:outline-none focus:border-glow-green/40 focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-200"
                  autoFocus
                />
              </div>
            </div>

            {/* Remember Key checkbox */}
            <button
              type="button"
              onClick={() => setRemember(!remember)}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div
                className={`relative w-5 h-5 rounded-md border transition-all duration-200 ${
                  remember
                    ? "bg-glow-green/20 border-glow-green/50"
                    : "bg-matte/60 border-white/10"
                }`}
              >
                {remember && (
                  <svg
                    className="absolute inset-0 w-full h-full text-glow-green p-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-accent group-hover:text-white transition-colors">
                Remember Key
              </span>
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-glow-green/15 border border-glow-green/30 text-glow-green font-medium text-sm uppercase tracking-wider hover:bg-glow-green/25 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  AUTHENTICATE
                </>
              )}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-accent/30">OR</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Support / Discord button */}
            <button
              onClick={() =>
                addToast({
                  type: "info",
                  title: "Discord Support",
                  message: "Join our Discord for support and key purchases."
                })
              }
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 hover:border-glow-blue/30 text-accent hover:text-glow-blue text-sm transition-all duration-200 group cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Purchase Key / Get Support
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-accent/30 mt-6 font-mono">
          © 2026 VERSX. All rights reserved.
        </p>
      </div>
    </div>
  );
}
