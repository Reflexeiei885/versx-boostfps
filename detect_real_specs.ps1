$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor
$gpus = Get-CimInstance Win32_VideoController
$gpu = $gpus | Where-Object { $_.Name -like '*NVIDIA*' } | Select-Object -First 1
if (-not $gpu) { $gpu = $gpus[0] }

$mem = Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum
$ramGB = [Math]::Round($mem.Sum / 1GB, 0)
$ramSpeed = (Get-CimInstance Win32_PhysicalMemory | Select-Object -First 1).Speed

# Check nvidia-smi if available for exact VRAM
$smi = & nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader 2>$null

Add-Type -AssemblyName System.Windows.Forms
$screen = [System.Windows.Forms.Screen]::PrimaryScreen

Write-Host "OS: $($os.Caption)"
Write-Host "CPU: $($cpu.Name.Trim())"
Write-Host "CPU_CORES: $($cpu.NumberOfCores) Cores / $($cpu.NumberOfLogicalProcessors) Threads"
Write-Host "CPU_CLOCK: $([Math]::Round($cpu.MaxClockSpeed / 1000, 1)) GHz"
Write-Host "GPU: $($gpu.Name)"
Write-Host "NVIDIA_SMI: $smi"
Write-Host "RAM: $ramGB GB DDR4"
Write-Host "RAM_SPEED: $ramSpeed MHz"
Write-Host "RES: $($screen.Bounds.Width) x $($screen.Bounds.Height)"
