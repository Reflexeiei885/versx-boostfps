@echo off
setlocal
cd /d "%~dp0"
net session >nul 2>&1
if not %errorlevel%==0 (
  echo Requesting Administrator permission...
  powershell -NoProfile -Command "Start-Process '%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"%~dp0install-bridge.ps1\"' -Verb RunAs"
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-bridge.ps1"
pause
