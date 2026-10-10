param([string]$Names)
$ErrorActionPreference = 'Continue'
# Same as record_queue.ps1 for a chosen list. Run nothing CPU-heavy at the same time (Whisper starved the page once).
$u = Get-Content <PROJECT_ROOT>\05_NARRATION\scrimba_urls.json -Raw | ConvertFrom-Json
$logs = '<PROJECT_ROOT>\05_NARRATION\logs'
foreach ($n in ($Names -split ",")) {
  "$(Get-Date -Format HH:mm:ss) START $n"
  & powershell -NoProfile -ExecutionPolicy Bypass -File <PROJECT_ROOT>\00_PROJECT\tools\record_explainer.ps1 -Url $u.$n -Name $n *> "$logs\rec_$n.log"
  $ok = Test-Path "<PROJECT_ROOT>\03_SCRIMBA_RAW\recordings\$n.mkv"
  "$(Get-Date -Format HH:mm:ss) DONE $n ok=$ok"
}
