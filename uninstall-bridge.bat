@echo off
setlocal
net session >nul 2>&1
if not %errorlevel%==0 (
  echo Requesting Administrator permission...
  powershell -NoProfile -Command "Start-Process '%~f0' -Verb RunAs"
  exit /b
)
powershell -NoProfile -Command "Unregister-ScheduledTask -TaskName 'VERSX BoostFPS Bridge' -Confirm:\$false -ErrorAction SilentlyContinue"
echo VERSX BoostFPS Bridge startup task removed.
pause
