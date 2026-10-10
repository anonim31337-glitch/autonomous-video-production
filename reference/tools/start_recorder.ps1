# Headless Chrome for recording Scrimba explainers: viewport exactly 1920x1080 @1x (window 1938x1176 minus 18x96px frame).
Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" | Where-Object { $_.CommandLine -match '<CHROME_PROFILE_NAME>' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep 2
Start-Process "<CHROME_EXE>" -ArgumentList @(
  '--headless=new', '--remote-debugging-port=9350', '--user-data-dir=<CHROME_PROFILE>', '--no-first-run',
  '--window-size=1938,1232', '--force-device-scale-factor=1', '--screen-info={1920x1200}', '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required', '--auto-accept-this-tab-capture',
  '--auto-select-tab-capture-source-by-title=YouTube', '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding', '--disable-background-timer-throttling', 'about:blank')
Start-Sleep 5





