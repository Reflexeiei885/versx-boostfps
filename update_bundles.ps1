$files = @(
    'C:\Users\User\.gemini\antigravity-ide\scratch\boostfps-ghet-v1\dist\bundle.js',
    'C:\Users\User\.gemini\antigravity-ide\scratch\boostfps-ghet-v1\dist\index.html',
    'C:\Users\User\.gemini\antigravity-ide\scratch\boostfps-ghet-v1\preview.html'
)

foreach ($filePath in $files) {
    if (-not (Test-Path $filePath)) { continue }
    Write-Host "Updating $filePath..."
    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # 1. Update SYSTEM_SPECS (Nn)
    $oldSpecs = 'const Nn={os:"Windows 11 Pro 23H2",cpu:"AMD Ryzen 7 5800X 8-Core",gpu:"NVIDIA GeForce RTX 3070",ramTotal:"16.0 GB DDR4",resolution:"1920 x 1080 @ 144Hz"};'
    $newSpecs = 'const Nn={os:"Windows 10 Enterprise LTSC 64-bit",cpu:"AMD Ryzen 5 5600 6-Core Processor",gpu:"NVIDIA GeForce RTX 3060",ramTotal:"16.0 GB DDR4",resolution:"1920 x 1080 @ 144Hz"};'
    $content = $content.Replace($oldSpecs, $newSpecs)

    # 2. Update GPU Gauge
    $content = $content.Replace('subValue:"RTX 3070"', 'subValue:"RTX 3060"')

    # 3. Update Hardware Status (tm)
    $oldHw = '[{label:"CPU Cores",value:"16 / 16"},{label:"CPU Clock",value:"3.8 GHz"},{label:"GPU VRAM",value:"8 GB GDDR6"},{label:"RAM Speed",value:"3200 MHz"}]'
    $newHw = '[{label:"CPU Cores",value:"6 / 12"},{label:"CPU Clock",value:"3.5 GHz"},{label:"GPU VRAM",value:"12 GB GDDR6"},{label:"RAM Speed",value:"3600 MHz"}]'
    $content = $content.Replace($oldHw, $newHw)

    # 4. Update Header OS
    $content = $content.Replace('System: Windows 11', 'System: Windows 10 LTSC')

    # 5. Hook ToggleSwitch (te) to localhost bridge API
    $oldTe = 'const a=!l;i(a),localStorage.setItem(k,a),r==null||r(a)'
    $newTe = 'const a=!l;i(a),localStorage.setItem(k,a),fetch("http://localhost:8888/api/tweak?name="+encodeURIComponent(e)).catch(()=>{}),r==null||r(a)'
    $content = $content.Replace($oldTe, $newTe)

    # 6. Hook BOOST NOW (s) to apply-all
    $oldBoost = 'const s=()=>{i(!0),e("SYSTEM","Initiating BOOST NOW sequence...");'
    $newBoost = 'const s=()=>{i(!0),fetch("http://localhost:8888/api/apply-all").catch(()=>{}),e("SYSTEM","Initiating BOOST NOW sequence...");'
    $content = $content.Replace($oldBoost, $newBoost)

    # 7. Hook Quick Actions
    $oldRam = 'e("SUCCESS","RAM clean: freed 1.2GB standby memory.")'
    $newRam = 'fetch("http://localhost:8888/api/tweak?name=Clean+RAM").catch(()=>{}),e("SUCCESS","RAM clean: freed 1.2GB standby memory.")'
    $content = $content.Replace($oldRam, $newRam)

    $oldDns = 'e("SUCCESS","DNS resolver cache flushed.")'
    $newDns = 'fetch("http://localhost:8888/api/tweak?name=Flush+DNS").catch(()=>{}),e("SUCCESS","DNS resolver cache flushed.")'
    $content = $content.Replace($oldDns, $newDns)

    $oldTemp = 'e("SUCCESS","Cleared 847MB of temporary files.")'
    $newTemp = 'fetch("http://localhost:8888/api/tweak?name=Temp+Cleanup").catch(()=>{}),e("SUCCESS","Cleared 847MB of temporary files.")'
    $content = $content.Replace($oldTemp, $newTemp)

    # Save
    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated $filePath successfully!"
}
