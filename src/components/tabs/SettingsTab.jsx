import React from 'react';
import { Settings, Palette, Bell, Info, Download, LogOut } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ActionButton from '../ActionButton';
import ToggleSwitch from '../ToggleSwitch';

const ABOUT_INFO = [
  { k: "Application", v: "Boost FPS Ghet" },
  { k: "Version", v: "v1.0.0" },
  { k: "Build", v: "2026.09.18" },
  { k: "License", v: "Premium" }
];

export default function SettingsTab() {
  const { addLog, addToast, setAuthenticated, clearLogs } = useStore();

  const handleExportConfig = () => {
    addLog("SUCCESS", "Configuration exported to boost_fps_config.json.");
    addToast({
      type: "success",
      title: "Config Exported",
      message: "Saved as boost_fps_config.json"
    });
  };

  const handleClearConsole = () => {
    clearLogs();
    addToast({ type: "info", title: "Logs Cleared" });
  };

  const handleLogout = () => {
    addLog("WARNING", "Session terminated by user.");
    setAuthenticated(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-glow-green" /> Settings
        </h2>
        <p className="text-sm text-accent/60">
          Configure application preferences and system options.
        </p>
      </div>

      {/* Application Preferences */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-glow-green" /> Application
        </p>
        <div className="grid gap-3">
          <ToggleSwitch
            label="Minimize to System Tray"
            description="Keep app running in background when closed."
            defaultOn={true}
          />
          <ToggleSwitch
            label="Start with Windows"
            description="Launch Boost FPS Ghet on system startup."
          />
          <ToggleSwitch
            label="Auto-apply tweaks on launch"
            description="Automatically re-apply all active tweaks when the app starts."
            defaultOn={true}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-glow-green" /> Notifications
        </p>
        <div className="grid gap-3">
          <ToggleSwitch
            label="Toast Notifications"
            description="Show pop-up alerts when actions complete."
            defaultOn={true}
          />
          <ToggleSwitch
            label="Sound Effects"
            description="Play audio cues for optimizations and errors."
          />
          <ToggleSwitch
            label="Desktop Notifications"
            description="Send Windows system notifications for important events."
          />
        </div>
      </div>

      {/* System Actions */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 text-glow-green" /> System Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            label="Export Configuration"
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportConfig}
          />
          <ActionButton
            label="Clear Log Console"
            variant="secondary"
            size="sm"
            icon={<Settings className="w-4 h-4" />}
            onClick={handleClearConsole}
          />
        </div>
      </div>

      {/* About Box */}
      <div className="glass rounded-xl p-5">
        <p className="text-sm font-medium text-white mb-3">About</p>
        <div className="space-y-2">
          {ABOUT_INFO.map((item) => (
            <div key={item.k} className="flex justify-between text-sm">
              <span className="text-accent/60">{item.k}</span>
              <span className="text-white font-mono">{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Session Button */}
      <div className="flex justify-end">
        <ActionButton
          label="Reload Application"
          variant="secondary"
          size="md"
          icon={<Settings className="w-4 h-4" />}
          onClick={() => window.location.reload()}
        />
      </div>
    </div>
  );
}
