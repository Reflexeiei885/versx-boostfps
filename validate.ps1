$html = [System.IO.File]::ReadAllText('C:\Users\User\.gemini\antigravity-ide\scratch\boostfps-ghet-v1\dist\index.html', [System.Text.Encoding]::UTF8)
$startTag = "<script>"
$endTag = "</script>"
$startIdx = $html.IndexOf($startTag)
$endIdx = $html.LastIndexOf($endTag)

Write-Host "Start tag idx: $startIdx"
Write-Host "End tag idx: $endIdx"

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $js = $html.Substring($startIdx + $startTag.Length, $endIdx - ($startIdx + $startTag.Length))
    Write-Host "Extracted JS length: $($js.Length)"
    
    # Check if there are unclosed tags or syntax issues
    $hasRoot = $html.Contains('<div id="root"></div>')
    Write-Host "Contains root div: $hasRoot"
}
