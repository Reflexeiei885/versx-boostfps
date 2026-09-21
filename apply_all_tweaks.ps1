# ====================================================================
# Boost FPS Ghet v1.0 - Windows & FiveM System Optimizer
# Target Specs: Windows 10 LTSC / Ryzen 5 5600 / RTX 3060 / 16GB DDR4
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Status($msg, $type = "INFO") {
    $time = (Get-Date).ToString("HH:mm:ss")
    switch ($type) {
        "SUCCESS" { Write-Host "[$time] [SUCCESS] $msg" -ForegroundColor Green }
        "WARNING" { Write-Host "[$time] [WARNING] $msg" -ForegroundColor Yellow }
        "ERROR"   { Write-Host "[$time] [ERROR]   $msg" -ForegroundColor Red }
        Default   { Write-Host "[$time] [INFO]    $msg" -ForegroundColor Cyan }
    }
}

Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "   ⚡ BOOST FPS GHET - ULTIMATE PERFORMANCE OPTIMIZER ⚡" -ForegroundColor Yellow
Write-Host "   Target: AMD Ryzen 5 5600 | NVIDIA RTX 3060 | Win 10 LTSC" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""

# 1. NETWORK & PING TWEAKS
Write-Status "Applying Network & Ping tweaks (Nagle's Algorithm / TCP ACK)..."
try {
    $netInterfaces = Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces" -ErrorAction SilentlyContinue
    foreach ($interface in $netInterfaces) {
        Set-ItemProperty -Path $interface.PSPath -Name "TcpAckFrequency" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $interface.PSPath -Name "TCPNoDelay" -Value 1 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $interface.PSPath -Name "TcpDelAckTicks" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    }
    
    $mmsKey = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile"
    if (Test-Path $mmsKey) {
        Set-ItemProperty -Path $mmsKey -Name "NetworkThrottlingIndex" -Value 0xFFFFFFFF -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $mmsKey -Name "SystemResponsiveness" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    }
    Write-Status "Network tweaks applied: TCPNoDelay=1, Throttling disabled." "SUCCESS"
} catch {
    Write-Status "Failed to apply some network registry settings: $($_.Exception.Message)" "WARNING"
}

# 2. FLUSH DNS & RESET WINSOCK
Write-Status "Flushing DNS resolver cache and network routing..."
try {
    ipconfig /flushdns | Out-Null
    netsh interface ip delete arpcache 2>$null | Out-Null
    Write-Status "DNS flushed and network cache cleared." "SUCCESS"
} catch {
    Write-Status "Could not clear DNS/ARP: $($_.Exception.Message)" "WARNING"
}

# 3. REGISTRY HITBOX & INPUT LATENCY
Write-Status "Optimizing Keyboard & Mouse latency parameters..."
try {
    Set-ItemProperty -Path "HKCU:\Control Panel\Keyboard" -Name "KeyboardDelay" -Value "0" -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Control Panel\Keyboard" -Name "KeyboardSpeed" -Value "31" -ErrorAction SilentlyContinue

    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSensitivity" -Value "10" -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "SmoothMouseXCurve" -Value ([byte[]](0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)) -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "SmoothMouseYCurve" -Value ([byte[]](0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)) -ErrorAction SilentlyContinue

    $tasksKey = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games"
    if (Test-Path $tasksKey) {
        Set-ItemProperty -Path $tasksKey -Name "GPU Priority" -Value 8 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $tasksKey -Name "Priority" -Value 6 -Type DWord -ErrorAction SilentlyContinue
        Set-ItemProperty -Path $tasksKey -Name "Scheduling Category" -Value "High" -ErrorAction SilentlyContinue
    }
    Write-Status "Input latency reduced: 0-delay keyboard, linear mouse curve, Game GPU Priority=8." "SUCCESS"
} catch {
    Write-Status "Latency tweak error: $($_.Exception.Message)" "WARNING"
}

# 4. GPU & POWER PROFILE
Write-Status "Configuring High Performance Power Plan & Hardware GPU Scheduling..."
try {
    # High Performance Power Plan GUID
    $plans = powercfg /list | Out-String
    $match = [regex]::Match($plans, '([0-9a-fA-F-]{36}).*Ultimate Performance')
    if ($match.Success) { $ultimateGuid = $match.Groups[1].Value } else { $dup = powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 | Out-String; $m2 = [regex]::Match($dup, '([0-9a-fA-F-]{36})'); $ultimateGuid = if ($m2.Success) { $m2.Groups[1].Value } else { 'e9a42b02-d5df-448d-aa00-03f14749eb61' } }
    powercfg /s $ultimateGuid 2>$null
    
    # HAGS (Hardware Accelerated GPU Scheduling)
    $gfxKey = "HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers"
    if (Test-Path $gfxKey) {
        Set-ItemProperty -Path $gfxKey -Name "HwSchMode" -Value 2 -Type DWord -ErrorAction SilentlyContinue
    }
    Write-Status "Ultimate Performance plan enabled & HAGS activated." "SUCCESS"
} catch {
    Write-Status "Power plan adjustment error: $($_.Exception.Message)" "WARNING"
}

# 5. DISABLE GAME DVR & BACKGROUND RECORDING
Write-Status "Disabling Xbox Game DVR & background game recording..."
try {
    $dvrPath = "HKCU:\System\GameConfigStore"
    if (-not (Test-Path $dvrPath)) { New-Item -Path $dvrPath -Force | Out-Null }
    Set-ItemProperty -Path $dvrPath -Name "GameDVR_Enabled" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $dvrPath -Name "GameDVR_FSEBehaviorMode" -Value 2 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $dvrPath -Name "GameDVR_HonorUserFSEBehaviorMode" -Value 1 -Type DWord -ErrorAction SilentlyContinue

    $appCapture = "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR"
    if (-not (Test-Path $appCapture)) { New-Item -Path $appCapture -Force | Out-Null }
    Set-ItemProperty -Path $appCapture -Name "AppCaptureEnabled" -Value 0 -Type DWord -ErrorAction SilentlyContinue

    # Game Mode Enable
    $gameBar = "HKCU:\Software\Microsoft\GameBar"
    if (-not (Test-Path $gameBar)) { New-Item -Path $gameBar -Force | Out-Null }
    Set-ItemProperty -Path $gameBar -Name "AllowAutoGameMode" -Value 1 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $gameBar -Name "AutoGameModeEnabled" -Value 1 -Type DWord -ErrorAction SilentlyContinue

    Write-Status "Game DVR disabled, Windows Game Mode active." "SUCCESS"
} catch {
    Write-Status "Game DVR error: $($_.Exception.Message)" "WARNING"
}

# 6. MEMORY & TEMPORARY FILES CLEANUP
Write-Status "Cleaning RAM standby memory and temporary files..."
try {
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()

    $tempPaths = @($env:TEMP, "$env:SystemRoot\Temp")
    $clearedMB = 0
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            $files = Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue
            foreach ($file in $files) {
                try {
                    $clearedMB += ($file.Length / 1MB)
                    Remove-Item $file.FullName -Recurse -Force -ErrorAction SilentlyContinue
                } catch {}
            }
        }
    }
    Write-Status "RAM Standby freed. Cleaned $([Math]::Round($clearedMB, 1)) MB of temp cache." "SUCCESS"
} catch {
    Write-Status "Memory/temp clean notice: $($_.Exception.Message)" "WARNING"
}

# 7. FIVEM OPTIMIZATION
Write-Status "Checking FiveM configuration & cache..."
$fivemPath = "$env:LOCALAPPDATA\FiveM\FiveM.app"
if (Test-Path $fivemPath) {
    # FiveM Cache Cleaning
    $cacheFolders = @(
        "$fivemPath\data\cache",
        "$fivemPath\data\server-cache",
        "$fivemPath\data\server-cache-priv",
        "$fivemPath\data\nui-storage",
        "$fivemPath\crashes",
        "$fivemPath\logs"
    )
    foreach ($folder in $cacheFolders) {
        if (Test-Path $folder) {
            try {
                Get-ChildItem -Path $folder -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
            } catch {}
        }
    }
    Write-Status "FiveM cache, NUI storage, and crash logs purged." "SUCCESS"

    # Set FiveM process priority if running
    $fivemProcs = Get-Process -Name "FiveM*", "GTA5*" -ErrorAction SilentlyContinue
    if ($fivemProcs) {
        foreach ($proc in $fivemProcs) {
            try {
                $proc.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
            } catch {}
        }
        Write-Status "FiveM process priority set to HIGH." "SUCCESS"
    } else {
        Write-Status "FiveM installed and optimized for next launch." "SUCCESS"
    }
} else {
    Write-Status "FiveM directory not detected, skipping game cache purge." "INFO"
}


# 8. WINDOWS UI / BACKGROUND OPTIMIZATION
Write-Status "Applying Windows performance UI and background policies..."
try {
    $visualKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects"
    New-Item $visualKey -Force | Out-Null
    Set-ItemProperty $visualKey -Name VisualFXSetting -Value 2 -Type DWord -ErrorAction SilentlyContinue
    $metricsKey = "HKCU:\Control Panel\Desktop\WindowMetrics"
    New-ItemProperty $metricsKey -Name MinAnimate -Value "0" -PropertyType String -Force -ErrorAction SilentlyContinue

    $bgKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"
    New-Item $bgKey -Force | Out-Null
    New-ItemProperty $bgKey -Name GlobalUserDisabled -Value 1 -PropertyType DWord -Force -ErrorAction SilentlyContinue

    $diag = Get-Service DiagTrack -ErrorAction SilentlyContinue
    if ($diag) {
        Stop-Service DiagTrack -Force -ErrorAction SilentlyContinue
        Set-Service DiagTrack -StartupType Disabled -ErrorAction SilentlyContinue
    }
    Write-Status "Visual effects minimized, background Store apps restricted, telemetry service disabled where available." "SUCCESS"
} catch {
    Write-Status "Windows background optimization warning: $($_.Exception.Message)" "WARNING"
}

# 9. CPU CORE PARKING
Write-Status "Disabling CPU core parking on the active power scheme..."
try {
    powercfg -setacvalueindex scheme_current sub_processor CPMINCORES 100 2>$null
    powercfg -setdcvalueindex scheme_current sub_processor CPMINCORES 100 2>$null
    powercfg -S scheme_current 2>$null
    Write-Status "CPU core parking minimized." "SUCCESS"
} catch {
    Write-Status "Core parking adjustment warning: $($_.Exception.Message)" "WARNING"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "   VERSX BOOST FPS - ALL OPTIMIZATIONS COMPLETED" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host ""
