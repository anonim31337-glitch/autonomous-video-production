// Record a Scrimba explainer's playback (video + narration) from its own tab.
// usage: node record.js <explainer_url> <out_name> [port]
// Chrome must run with: --auto-accept-this-tab-capture --auto-select-tab-capture-source-by-title=<title part>
//   --autoplay-policy=no-user-gesture-required --disable-backgrounding-occluded-windows
//   --disable-renderer-backgrounding --disable-background-timer-throttling
const [url, name, port = '9350'] = process.argv.slice(2);
const OUT = '<PROJECT_ROOT>\\03_SCRIMBA_RAW\\recordings';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const id = url.match(/guide\w+/)[0];
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  let tab = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  let seq = 1;
  const req = (method, params = {}) => new Promise(res => {
    const i = seq++;
    const on = ev => { const m = JSON.parse(ev.data); if (m.id === i) { ws.removeEventListener('message', on); res(m.result || m); } };
    ws.addEventListener('message', on);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const ev = async (expression, userGesture = false) => {
    const r = await Promise.race([req('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture }),
      sleep(120000).then(() => ({ exceptionDetails: 'evaluate timeout 120 s' }))]);
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600));
    return r.result?.value;
  };

  // no viewport emulation: tab capture grabs the real surface, so the window itself must be 1920x1080 @1x
  await req('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT });
  // Scrimba remembers the playback position per viewer: wipe it so every recording starts at 0:00
  await req('Storage.clearDataForOrigin', { origin: 'https://scrimba.com', storageTypes: 'all' });
  await req('Page.navigate', { url });
  await sleep(10000);

  // wait until every slide finished generating its image (Scrimba generates on first open)
  for (let k = 0; k < 90; k++) {
    const pending = await ev(`document.querySelectorAll('guide-image .loading, guide-image [aria-busy=true], .generating').length`);
    if (!pending) break;
    await sleep(2000);
  }

  await ev(`(() => { const s = document.createElement('style'); s.textContent = \`
    html, body { overflow: hidden !important; scrollbar-width: none !important; }
    ::-webkit-scrollbar { display: none !important; }
    .guide-close, .guide-rating, .guide-actions, voice-over-control, .guide-big-play, consent-banner, app-banner,
    guide-page form, guide-page textarea, guide-page input[type=text], [placeholder="Change this slide?"],
    .guide-change, .guide-redo, guide-slide-prompt, guide-prompt, guide-captions
      { visibility: hidden !important; }\`; document.head.appendChild(s);
    // the per-slide "Change this slide?" box: hide its whole small container, re-checked as slides change
    const hideAsk = () => document.querySelectorAll('[placeholder]').forEach(i => {
      let e = i; while (e.parentElement && e.parentElement.getBoundingClientRect().width < 900) e = e.parentElement;
      e.style.setProperty('visibility', 'hidden', 'important'); });
    hideAsk(); setInterval(hideAsk, 200); return 1; })()`);
  const total = await ev(`document.querySelector('voice-over-control .time')?.textContent || ''`);
  console.log('player time', total);

  const started = await ev(`(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: { ideal: 30, max: 30 } },  // native surface size; no rescale inside the browser
      audio: { suppressLocalAudioPlayback: false, echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      preferCurrentTab: true, selfBrowserSurface: 'include', surfaceSwitching: 'exclude' });
    window.__chunks = [];
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 16e6, audioBitsPerSecond: 256e3 });
    rec.ondataavailable = e => e.data.size && window.__chunks.push(e.data);
    window.__rec = rec; window.__stream = stream;
    rec.start(1000);
    window.__t0 = performance.now();
    // timeline log relative to recording start: current caption word, caption line, active slide index
    window.__log = []; let lw = '', ll = '', ls = -1;
    window.__logTimer = setInterval(() => {
      const t = +((performance.now() - window.__t0) / 1000).toFixed(3);
      const line = document.querySelector('guide-captions .caption-line');
      const lt = line ? line.textContent.trim() : '';
      const cw = document.querySelector('guide-captions .current');
      const w = cw ? cw.textContent.trim() : '';
      const slides = [...document.querySelectorAll('section.guide-slide')];
      const s = slides.findIndex(x => x.classList.contains('active'));
      if (lt !== ll) { window.__log.push({ t, k: 'line', v: lt }); ll = lt; }
      if (w !== lw) { window.__log.push({ t, k: 'word', v: w }); lw = w; }
      if (s !== ls) { window.__log.push({ t, k: 'slide', v: s, title: slides[s]?.querySelector('h1,h2')?.textContent.trim() || '' }); ls = s; }
      // "Don't lose this explainer" sign-up nag pauses playback for anonymous viewers: dismiss it and log the gap
      const cont = [...document.querySelectorAll('a,button,op-button,[role=button],span')].find(e => (e.textContent || '').trim() === 'Continue watching' && e.getBoundingClientRect().width > 0);
      if (cont) { if (!window.__nag) { window.__nag = t; window.__log.push({ t, k: 'nag_on' }); } cont.click(); }
      else if (window.__nag) { window.__log.push({ t, k: 'nag_off', from: window.__nag }); window.__nag = 0; }
    }, 50);
    const s = stream.getVideoTracks()[0].getSettings();
    return { w: s.width, h: s.height, fps: s.frameRate, audio: stream.getAudioTracks().length };
  })()`, true);
  console.log('capture', JSON.stringify(started));
  await sleep(1200);  // lead-in so the first narration frame is not clipped
  await ev(`(() => { const b = document.querySelector('.guide-big-play') || document.querySelector('voice-over-control op-button.play'); b.click(); return 1; })()`, true);
  await ev(`(() => { window.__playAt = performance.now() - window.__t0; return 1; })()`);

  // follow playback until the clock reads "x / x"
  let last = '', stuck = 0;
  for (;;) {
    await sleep(2000);
    const t = await ev(`document.querySelector('voice-over-control .time')?.textContent || ''`);
    const [a, b] = t.split('/').map(s => s.trim());
    process.stdout.write(`\r${t}   `);
    if (a && b && a === b) break;
    stuck = t === last ? stuck + 1 : 0;
    last = t;
    if (stuck > 30) { console.log('\nplayback stalled at', t); break; }
  }
  await sleep(1500);  // tail
  const info = await ev(`(async () => {
    clearInterval(window.__logTimer);
    const rec = window.__rec; const done = new Promise(r => (rec.onstop = r)); rec.stop(); await done;
    window.__stream.getTracks().forEach(t => t.stop());
    const blob = new Blob(window.__chunks, { type: 'video/webm' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '${name}.webm';
    document.body.appendChild(a); a.click();
    return { bytes: blob.size, playAt_ms: Math.round(window.__playAt) };
  })()`);
  console.log('\nsaved', name + '.webm', JSON.stringify(info));
  const log = await ev(`JSON.stringify(window.__log)`);
  require('fs').writeFileSync(`${OUT}\\${name}.timeline.json`, log);
  console.log('timeline events', JSON.parse(log).length);
  require('fs').writeFileSync(`${OUT}\\${name}.json`, JSON.stringify({ url, ...started, ...info, player_time: total }, null, 1));
  await sleep(8000);
  ws.close();
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
