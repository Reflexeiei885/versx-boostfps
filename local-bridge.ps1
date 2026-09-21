param([int]$Port = 8888)
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$applyAll = Join-Path $root 'apply_all_tweaks.ps1'
$stateDir = Join-Path $env:ProgramData 'VERSX'
$stateFile = Join-Path $stateDir 'state.json'
New-Item -ItemType Directory -Path $stateDir -Force | Out-Null

function Json($obj) { $obj | ConvertTo-Json -Depth 8 -Compress }
function Ok($message, $data = $null) { @{ success=$true; message=$message; data=$data } }
function Fail($message) { @{ success=$false; message=$message } }
function AdminCheck { ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator) }
function RunCmd($file, $args) { & $file @args 2>&1 | Out-String }
function RunPs($script) { & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $script 2>&1 | Out-String }

function SaveState($name, $value) {
  $state=@{}
  if(Test-Path $stateFile){ try{$state=Get-Content $stateFile -Raw | ConvertFrom-Json -AsHashtable}catch{$state=@{}} }
  $state[$name]=$value
  $state | ConvertTo-Json -Depth 8 | Set-Content $stateFile -Encoding UTF8
}
function GetState($name) {
  if(!(Test-Path $stateFile)){ return $null }
  try { $state=Get-Content $stateFile -Raw | ConvertFrom-Json -AsHashtable; return $state[$name] } catch { return $null }
}

function Specs {
  $os=Get-CimInstance Win32_OperatingSystem
  $cpu=Get-CimInstance Win32_Processor | Select-Object -First 1
  $gpu=Get-CimInstance Win32_VideoController | Where-Object { $_.Name -notlike '*Basic*' } | Select-Object -First 1
  $mem=Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum
  $ram=[math]::Round($mem.Sum/1GB,0)
  $ramSpeed=(Get-CimInstance Win32_PhysicalMemory | Select-Object -First 1).Speed
  $screen=Get-CimInstance Win32_VideoController | Where-Object CurrentHorizontalResolution | Select-Object -First 1
  @{os="$($os.Caption) $($os.OSArchitecture)"; osShort="System: $($os.Caption)"; cpu=$cpu.Name.Trim(); cores="$($cpu.NumberOfCores) Cores / $($cpu.NumberOfLogicalProcessors) Threads"; clock="$([math]::Round($cpu.MaxClockSpeed/1000,1)) GHz"; gpu=$gpu.Name; gpuShort=($gpu.Name -replace 'NVIDIA GeForce |AMD Radeon ',''); vram="$([math]::Round($gpu.AdapterRAM/1GB,0)) GB"; ramTotal="$ram GB"; ramTotalNum=$ram; ramSpeed="$ramSpeed MHz"; resolution="$($screen.CurrentHorizontalResolution) x $($screen.CurrentVerticalResolution) @ $($screen.CurrentRefreshRate)Hz"}
}

function Metrics {
  $cpu=0; $ram=0; $disk=0; $gpu=0
  try { $cpu=[math]::Round((Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'").PercentProcessorTime,1) } catch {}
  try { $os=Get-CimInstance Win32_OperatingSystem; $ram=[math]::Round((1-($os.FreePhysicalMemory/$os.TotalVisibleMemorySize))*100,1) } catch {}
  try { $disk=[math]::Round((Get-CimInstance Win32_PerfFormattedData_PerfDisk_PhysicalDisk -Filter "Name='_Total'").PercentDiskTime,1) } catch {}
  try {
    $c=Get-Counter '\GPU Engine(*)\Utilization Percentage' -ErrorAction Stop
    $vals=@($c.CounterSamples | Where-Object { $_.InstanceName -match 'engtype_3D' } | ForEach-Object {[double]$_.CookedValue})
    if($vals.Count){ $gpu=[math]::Round([math]::Min(100,($vals | Measure-Object -Maximum).Maximum),1) }
  } catch {}
  @{cpu=$cpu; ram=$ram; gpu=$gpu; disk=[math]::Min(100,$disk); timestamp=(Get-Date).ToString('o')}
}

function FiveMConfigPath {
  $p=Join-Path $env:LOCALAPPDATA 'FiveM\FiveM.app\CitizenFX.ini'
  if(Test-Path $p){ return $p }
  return $null
}
function FiveMCfgPath {
  $p=Join-Path $env:APPDATA 'CitizenFX\fivem.cfg'
  if(Test-Path $p){ return $p }
  return $p
}
function SetFiveMTexture($value) {
  $cfg=FiveMCfgPath
  $dir=Split-Path $cfg
  New-Item -ItemType Directory -Path $dir -Force | Out-Null
  $line="seta str_maxVehicleTextureRes $value"
  $lines=@()
  if(Test-Path $cfg){ $lines=@(Get-Content $cfg -ErrorAction SilentlyContinue) }
  $found=$false
  $out=foreach($l in $lines){ if($l -match '^\s*seta\s+str_maxVehicleTextureRes\s+'){ $found=$true; $line } else { $l } }
  if(!$found){ $out += $line }
  $out | Set-Content $cfg -Encoding UTF8
  return $cfg
}
function SetFiveMProfile($profile) {
  switch($profile){
    'Ultra Performance' { $v=512 }
    'Balanced' { $v=1024 }
    'Quality' { $v=2048 }
    default { return Fail 'Unknown FiveM profile.' }
  }
  $cfg=SetFiveMTexture $v
  return Ok "$profile profile applied. FiveM texture resolution limit set to $v." @{file=$cfg; value=$v}
}

function Tweak($name) {
 switch -Regex ($name) {
  '^Boost All$' { if(!(AdminCheck)){return Fail 'Run the local bridge as Administrator.'}; $out=RunPs $applyAll; return Ok 'All BoostFPS optimizations applied.' @{output=$out} }
  '^Flush DNS$' { return Ok 'DNS cache flushed.' @{output=(RunCmd 'ipconfig.exe' @('/flushdns'))} }
  '^FiveM Cache$' { $p="$env:LOCALAPPDATA\FiveM\FiveM.app"; if(!(Test-Path $p)){return Fail 'FiveM installation was not found.'}; $total=0.0; @("$p\data\cache","$p\data\server-cache","$p\data\server-cache-priv","$p\data\nui-storage","$p\crashes","$p\logs") | ForEach-Object {if(Test-Path $_){$files=Get-ChildItem $_ -Recurse -Force -File -ErrorAction SilentlyContinue; $total += (($files | Measure-Object Length -Sum).Sum / 1MB); $files | Remove-Item -Force -ErrorAction SilentlyContinue}}; return Ok 'FiveM cache, NUI storage and logs cleared.' @{cleanedMb=[math]::Round($total,1)} }
  '^FiveM Priority$' { $ps=Get-Process -Name 'FiveM*','GTA5*' -ErrorAction SilentlyContinue; if(!$ps){return Fail 'FiveM/GTA5 is not running. Start FiveM first, then press the button again.')}; $ps | ForEach-Object {try{$_.PriorityClass='High'}catch{}}; return Ok 'FiveM/GTA5 process priority set to High.' }
  '^FiveM Texture:(\d+)$' { $v=[int]$Matches[1]; if($v -lt 512 -or $v -gt 8192){return Fail 'Texture value must be 512-8192 MB.'}; $cfg=SetFiveMTexture $v; return Ok "FiveM texture resolution limit set to $v." @{file=$cfg;value=$v} }
  '^FiveM Profile:(.+)$' { return SetFiveMProfile $Matches[1] }
  '^Background Apps:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; $p='HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications'; New-Item $p -Force | Out-Null; $v=if($Matches[1] -eq 'off'){1}else{0}; New-ItemProperty $p GlobalUserDisabled $v -PropertyType DWord -Force | Out-Null; $msg=if($v -eq 1){'Background Store apps disabled.'}else{'Background Store apps enabled.'}; return Ok $msg }
  '^Disable Telemetry:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; $svc=Get-Service DiagTrack -ErrorAction SilentlyContinue; if($Matches[1] -eq 'on'){if($svc){Stop-Service DiagTrack -Force -ErrorAction SilentlyContinue;Set-Service DiagTrack -StartupType Disabled -ErrorAction SilentlyContinue}}else{if($svc){Set-Service DiagTrack -StartupType Manual -ErrorAction SilentlyContinue;Start-Service DiagTrack -ErrorAction SilentlyContinue}}; $msg=if($Matches[1] -eq 'on'){'Telemetry service disabled.'}else{'Telemetry service restored to Manual.'}; return Ok $msg }
  '^Game DVR:(on|off)$' { $off=($Matches[1] -eq 'on'); $p='HKCU:\System\GameConfigStore'; New-Item $p -Force|Out-Null; New-ItemProperty $p GameDVR_Enabled ([int](!$off)) -PropertyType DWord -Force|Out-Null; $q='HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR'; New-Item $q -Force|Out-Null; New-ItemProperty $q AppCaptureEnabled ([int](!$off)) -PropertyType DWord -Force|Out-Null; $msg=if($off){'Game DVR/background recording disabled.'}else{'Game DVR/background recording enabled.'}; return Ok $msg }
  '^High Performance:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; if($Matches[1] -eq 'on'){ $list=powercfg.exe /list | Out-String; $m=[regex]::Match($list,'([0-9a-fA-F-]{36}).*Ultimate Performance'); if($m.Success){$guid=$m.Groups[1].Value}else{$dup=powercfg.exe /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 | Out-String; $m=[regex]::Match($dup,'([0-9a-fA-F-]{36})'); $guid=if($m.Success){$m.Groups[1].Value}else{'e9a42b02-d5df-448d-aa00-03f14749eb61'}}; powercfg.exe /s $guid } else {powercfg.exe /s SCHEME_BALANCED}; $msg=if($Matches[1] -eq 'on'){'Ultimate Performance power plan enabled.'}else{'Balanced power plan restored.'}; return Ok $msg }
  '^Visual Effects:(on|off)$' { $p='HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects'; New-Item $p -Force|Out-Null; $v=if($Matches[1] -eq 'on'){2}else{0}; New-ItemProperty $p VisualFXSetting $v -PropertyType DWord -Force|Out-Null; $animate=if($v -eq 2){'0'}else{'1'}; New-ItemProperty 'HKCU:\Control Panel\Desktop\WindowMetrics' MinAnimate $animate -PropertyType String -Force|Out-Null; $msg=if($v -eq 2){'Windows visual effects set for performance.'}else{'Windows visual effects restored to Windows-managed mode.'}; return Ok $msg }
  '^Startup:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; $run='HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'; $backup=Join-Path $stateDir 'startup-run-backup.reg'; if($Matches[1] -eq 'off'){ if(Test-Path $run){ & reg.exe export 'HKCU\Software\Microsoft\Windows\CurrentVersion\Run' $backup /y | Out-Null; Get-ItemProperty $run | ForEach-Object { $_.PSObject.Properties | Where-Object {$_.Name -notmatch '^PS'} | ForEach-Object { Remove-ItemProperty $run $_.Name -Force -ErrorAction SilentlyContinue } } }; return Ok 'Current-user startup entries disabled and backed up.' @{backup=$backup} } else { if(Test-Path $backup){ & reg.exe import $backup | Out-Null; return Ok 'Current-user startup entries restored from backup.' } return Ok 'No VERSX startup backup was found.' } }
  '^Game Mode:(on|off)$' { $p='HKCU:\Software\Microsoft\GameBar'; New-Item $p -Force|Out-Null; New-ItemProperty $p AllowAutoGameMode ([int]($Matches[1] -eq 'on')) -PropertyType DWord -Force|Out-Null; New-ItemProperty $p AutoGameModeEnabled ([int]($Matches[1] -eq 'on')) -PropertyType DWord -Force|Out-Null; $msg=if($Matches[1] -eq 'on'){'Windows Game Mode enabled.'}else{'Windows Game Mode disabled.'}; return Ok $msg }
  '^Disable Superfetch$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; $svc=Get-Service SysMain -ErrorAction SilentlyContinue;if($svc){Stop-Service SysMain -Force;Set-Service SysMain -StartupType Disabled};return Ok 'SysMain/Superfetch disabled.' }
  '^Disable Windows Search$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'};$svc=Get-Service WSearch -ErrorAction SilentlyContinue;if($svc){Stop-Service WSearch -Force;Set-Service WSearch -StartupType Disabled};return Ok 'Windows Search indexing disabled.' }
  '^Disable Print Spooler$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'};$svc=Get-Service Spooler -ErrorAction SilentlyContinue;if($svc){Stop-Service Spooler -Force;Set-Service Spooler -StartupType Disabled};return Ok 'Print Spooler disabled.' }
  '^Clean RAM$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; $out=RunCmd 'powershell.exe' @('-NoProfile','-Command','[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers(); Start-Sleep -Milliseconds 150'); return Ok 'Memory cleanup request completed.' @{output=$out} }
  '^Temp Cleanup$' { $paths=@($env:TEMP,"$env:SystemRoot\Temp"); $total=0.0; foreach($tp in $paths){if(Test-Path $tp){$files=Get-ChildItem $tp -Recurse -Force -File -ErrorAction SilentlyContinue; $total += (($files | Measure-Object Length -Sum).Sum / 1MB); $files | Remove-Item -Force -ErrorAction SilentlyContinue}}; return Ok 'Temporary files cleaned.' @{cleanedMb=[math]::Round($total,1)} }
  '^Nagle:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'}; $enable=($Matches[1] -eq 'on'); Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces' | ForEach-Object {New-ItemProperty $_.PSPath TcpAckFrequency ([int]$enable) -PropertyType DWord -Force;New-ItemProperty $_.PSPath TCPNoDelay ([int]$enable) -PropertyType DWord -Force;New-ItemProperty $_.PSPath TcpDelAckTicks 0 -PropertyType DWord -Force};$msg=if($enable){'Nagle latency tweak enabled.'}else{'Nagle latency tweak disabled.'}; return Ok $msg }
  '^Network Throttling:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'};$p='HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile';$v=if($Matches[1] -eq 'on'){0xFFFFFFFF}else{10};New-ItemProperty $p NetworkThrottlingIndex $v -PropertyType DWord -Force;New-ItemProperty $p SystemResponsiveness (if($Matches[1] -eq 'on'){0}else{20}) -PropertyType DWord -Force;return Ok 'Network throttling profile updated.' }
  '^HAGS:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'};$v=if($Matches[1] -eq 'on'){2}else{1};$p='HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers';New-ItemProperty $p HwSchMode $v -PropertyType DWord -Force;$msg=if($v -eq 2){'HAGS enabled.'}else{'HAGS disabled.'}; return Ok $msg }
  '^Disable Core Parking:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'};$v=if($Matches[1] -eq 'on'){100}else{0};powercfg.exe -setacvalueindex scheme_current sub_processor CPMINCORES $v;powercfg.exe -setdcvalueindex scheme_current sub_processor CPMINCORES $v;powercfg.exe -S scheme_current;$msg=if($v -eq 100){'CPU core parking disabled.'}else{'CPU core parking restored to Windows-managed mode.'}; return Ok $msg }
  '^GPU Power Saving:(on|off)$' { if(!(AdminCheck)){return Fail 'Administrator permission required.'};$v=if($Matches[1] -eq 'on'){0}else{1};powercfg.exe -setacvalueindex scheme_current SUB_PCIEXPRESS ASPM $v;powercfg.exe -S scheme_current;$msg=if($v -eq 0){'PCIe power saving disabled for AC performance.'}else{'PCIe power saving restored.'}; return Ok $msg }
  '^Timer 0.5ms$' { try{Add-Type @' 
using System; using System.Runtime.InteropServices; public static class VxTimer { [DllImport("ntdll.dll")] public static extern int NtSetTimerResolution(uint DesiredResolution, bool SetResolution, out uint CurrentResolution); }
'@ -ErrorAction SilentlyContinue;[uint32]$cur=0;[VxTimer]::NtSetTimerResolution(5000,$true,[ref]$cur)|Out-Null;return Ok 'Timer resolution request set to 0.5ms while the bridge is running.'}catch{return Fail $_.Exception.Message} }
  '^GPU Power Mode:(.+)$' { $mode=$Matches[1];$nvidia=Get-Command nvidia-smi.exe -ErrorAction SilentlyContinue;if($nvidia){if($mode -eq 'Prefer Maximum Performance'){RunCmd $nvidia.Source @('-pm','1')|Out-Null}else{RunCmd $nvidia.Source @('-pm','0')|Out-Null};return Ok "NVIDIA persistence mode adjusted for $mode."};return Ok "GPU mode selected: $mode. Windows power policy is used; vendor-specific control panel profile was not changed." }
  default { return Fail "Unknown tweak: $name" }
 }
}

$listener=New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "VERSX Boost Bridge listening on http://localhost:$Port" -ForegroundColor Green
Write-Host "Administrator: $(AdminCheck)" -ForegroundColor Cyan
while($listener.IsListening){
 try{
  $ctx=$listener.GetContext();$req=$ctx.Request;$res=$ctx.Response
  $origin=$req.Headers['Origin']
  $allowedOrigin=$false
  if($origin -and ($origin -match '^https?://localhost(:\d+)?$' -or $origin -match '^https?://127\.0\.0\.1(:\d+)?$' -or $origin -match '^https://[A-Za-z0-9.-]+\.vercel\.app$')){$allowedOrigin=$true}
  if($allowedOrigin){
    $res.Headers.Add('Access-Control-Allow-Origin',$origin)
    $res.Headers.Add('Vary','Origin')
  }
  $res.Headers.Add('Access-Control-Allow-Headers','Content-Type')
  $res.Headers.Add('Access-Control-Allow-Methods','GET,POST,OPTIONS')
  $res.Headers.Add('Access-Control-Allow-Private-Network','true')
  if($req.HttpMethod -eq 'OPTIONS'){$res.StatusCode=204;$res.Close();continue}
  $path=$req.Url.AbsolutePath;$result=$null
  if($path -eq '/api/health'){$result=Ok 'VERSX local bridge online.' @{admin=(AdminCheck)}}
  elseif($path -eq '/api/specs'){$result=Ok 'Specs detected.' (Specs)}
  elseif($path -eq '/api/metrics'){$result=Ok 'Metrics sampled.' (Metrics)}
  elseif($path -eq '/api/tweak'){$result=Tweak $req.QueryString['name']}
  elseif($path -eq '/api/apply-all'){$result=Tweak 'Boost All'}
  else{$res.StatusCode=404;$result=Fail 'Not found.'}
  $body=[Text.Encoding]::UTF8.GetBytes((Json $result));$res.ContentType='application/json; charset=utf-8';$res.ContentLength64=$body.Length;$res.OutputStream.Write($body,0,$body.Length);$res.Close()
 }catch{try{$res.StatusCode=500;$body=[Text.Encoding]::UTF8.GetBytes((Json (Fail $_.Exception.Message)));$res.OutputStream.Write($body,0,$body.Length);$res.Close()}catch{}}
}
