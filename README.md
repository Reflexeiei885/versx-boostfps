# VERSX BoostFPS — Real Local Tweaks

VERSX UI with the Hacker Clean design plus a local Windows bridge for real system actions.

## First-time Windows setup

1. Put this whole folder somewhere on the Windows PC.
2. Run `install-bridge.bat` **as Administrator** once.
3. The bridge is registered to start with Windows and listens on `http://localhost:8888`.
4. Open the VERSX website.
5. The Dashboard graph will use live CPU/RAM/GPU/Disk counters when the bridge is online.
6. `BOOST NOW` executes the real `apply_all_tweaks.ps1` script through the local bridge.

You do not need to keep a PowerShell window open manually after the scheduled task is installed.

## Remove automatic startup

Run `uninstall-bridge.bat` as Administrator.

## What is real

- Windows power plan / HAGS / Game DVR / Game Mode
- Windows visual-effects performance mode
- Background Store-app policy
- Telemetry service policy
- CPU core parking
- Network/DNS actions
- FiveM cache cleanup
- FiveM process priority
- FiveM texture-resolution limit written to `%APPDATA%\CitizenFX\fivem.cfg`
- Timer-resolution request while the bridge is running
- Hardware/GPU power-policy actions supported by the local machine

The UI does not claim success until the local bridge returns a successful result.

## Important

A browser cannot directly modify Windows. The local bridge is required for real system changes and must run with Administrator privileges for actions that need elevation.


### v5 browser-to-local bridge compatibility
- The bridge uses `127.0.0.1:8888` for browser requests.
- CORS allows Vercel deployments and loopback origins.
- Private Network Access preflight is explicitly allowed with `Access-Control-Allow-Private-Network: true`.
- The installer uses Windows Scheduled Task logon type `Interactive`, which is supported on Windows PowerShell versions that reject `InteractiveToken`.
- If the web still reports `FAIL`, open `http://127.0.0.1:8888/api/health` in the same PC/browser. It should return `success: true`.
