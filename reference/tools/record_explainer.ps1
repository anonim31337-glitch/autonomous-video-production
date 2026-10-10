# Warm up (Scrimba generates images on first open), then record. usage: record_explainer.ps1 <url> <name>
param([string]$Url, [string]$Name)
$T = '<PROJECT_ROOT>\00_PROJECT\tools'
& "$T\start_recorder.ps1"
$env:CDP_PORT = 9350
node "$T\cdp.js" nav $Url | Out-Null
Start-Sleep 120
node "$T\cdp.js" eval "document.querySelectorAll('guide-image').length + ' image slides'" | Write-Output
node "$T\record.js" $Url $Name 9350
$ff = '<FFMPEG_BIN>'
$d = '<PROJECT_ROOT>\03_SCRIMBA_RAW\recordings'
Start-Sleep 5
& "$ff\ffmpeg.exe" -v error -y -i "$d\$Name.webm" -c copy "$d\$Name.mkv"
& "$ff\ffprobe.exe" -v error -show_entries format=duration -of csv=p=0 "$d\$Name.mkv"
& "$ff\ffmpeg.exe" -v error -y -i "$d\$Name.mkv" -vf "fps=1/15,scale=384:-1,tile=6x6" -frames:v 1 "$d\${Name}_contact.png"
"DONE $Name"
