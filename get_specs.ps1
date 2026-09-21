$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor
$gpu = Get-CimInstance Win32_VideoController | Where-Object { $_.AdapterRAM -gt 0 -or $_.Name -notlike "*Basic*" } | Select-Object -First 1
if (-not $gpu) { $gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1 }
$mem = Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum
$ramGB = [Math]::Round($mem.Sum / 1GB, 0)
$ramSpeed = (Get-CimInstance Win32_PhysicalMemory | Select-Object -First 1).Speed

Write-Host "OS: $($os.Caption) $($os.OSArchitecture)"
Write-Host "CPU: $($cpu.Name)"
Write-Host "CPU Cores: $($cpu.NumberOfCores) Cores / $($cpu.NumberOfLogicalProcessors) Threads"
Write-Host "CPU Speed: $([Math]::Round($cpu.MaxClockSpeed / 1000, 1)) GHz"
Write-Host "GPU: $($gpu.Name)"
Write-Host "GPU VRAM: $([Math]::Round($gpu.AdapterRAM / 1GB, 0)) GB"
Write-Host "RAM: $ramGB GB"
Write-Host "RAM Speed: $ramSpeed MHz"
Write-Host "Resolution: $($gpu.CurrentHorizontalResolution) x $($gpu.CurrentVerticalResolution) @ $($gpu.CurrentRefreshRate)Hz"
