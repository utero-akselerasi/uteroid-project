const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  ready() {
    return new Promise((resolve) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function startChrome() {
  const chromeProcess = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      `--remote-debugging-port=${PORT}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + path.join(__dirname, '..', 'scratch', 'chrome-profile'),
    ],
    { stdio: 'ignore' }
  );

  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
      if (version) return chromeProcess;
    } catch (e) {}
  }
  throw new Error('Chrome failed to start');
}

async function captureScreenshot(client, filepath) {
  const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
  console.log(`Saved screenshot: ${path.basename(filepath)}`);
}

async function setViewport(client, width, height, isMobile = false) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: isMobile,
  });
}

async function waitForImages(client) {
  await sleep(1500);
}

async function run() {
  console.log('Launching headless Chrome...');
  const chromeProc = await startChrome();

  try {
    const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.ready();
    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    // ─────────────────────────────────────────────────────────────
    // 1. Desktop /work grid (1440x900)
    // ─────────────────────────────────────────────────────────────
    console.log('1. Capturing Desktop /work grid (1440px)...');
    await setViewport(client, 1440, 900);
    await client.send('Page.navigate', { url: 'http://localhost:3000/work' });
    await sleep(2500);
    await waitForImages(client);
    await sleep(1000);

    // Scroll slightly so cards are centered in viewport
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 380, behavior: 'instant' })`,
    });
    await sleep(1000);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '01-work-grid-desktop-1440.png'));

    // Scroll to row containing JMT & Lacamino
    console.log('1b. Capturing JMT & Lacamino in /work grid...');
    await client.send('Runtime.evaluate', {
      expression: `
        const jmt = document.querySelector('a[href="/work/jmt"]');
        if (jmt) jmt.scrollIntoView({ block: 'center' });
      `,
    });
    await sleep(1500);
    await waitForImages(client);
    await sleep(800);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '02-work-grid-jmt-lacamino.png'));

    // Scroll to Maitri
    console.log('1c. Capturing Maitri in /work grid...');
    await client.send('Runtime.evaluate', {
      expression: `
        const maitri = document.querySelector('a[href="/work/maitri"]');
        if (maitri) maitri.scrollIntoView({ block: 'center' });
      `,
    });
    await sleep(1500);
    await waitForImages(client);
    await sleep(800);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '03-work-grid-maitri.png'));

    // ─────────────────────────────────────────────────────────────
    // 2. Hover interaction proof on /work card
    // ─────────────────────────────────────────────────────────────
    console.log('2. Capturing Hover Crossfade on GaragePlug card...');
    await client.send('Runtime.evaluate', {
      expression: `
        const gp = document.querySelector('a[href="/work/garageplug"]');
        if (gp) gp.scrollIntoView({ block: 'center' });
      `,
    });
    await sleep(800);
    // Simulate hover by dispatching mouseenter / mousemove
    const { result: box } = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.querySelector('a[href="/work/garageplug"]');
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        })()
      `,
      returnByValue: true,
    });
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: (box.value && box.value.x) || 0,
      y: (box.value && box.value.y) || 0,
    });
    await sleep(600); // Allow 0.35s CSS opacity transition to complete
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '04-work-grid-hover-crossfade.png'));

    // Reset mouse
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 0,
      y: 0,
    });

    // ─────────────────────────────────────────────────────────────
    // 3. GaragePlug detail hero + deck watermark
    // ─────────────────────────────────────────────────────────────
    console.log('3. Capturing GaragePlug detail hero (original PDF cover)...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/work/garageplug' });
    await sleep(2500);
    await waitForImages(client);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '05-garageplug-detail-hero.png'));

    console.log('3b. Capturing GaragePlug Deck Slide 2 (Watermark proof)...');
    await client.send('Runtime.evaluate', {
      expression: `
        const slider = document.querySelector('.pd-deck-slider');
        if (slider) slider.scrollIntoView({ block: 'center' });
      `,
    });
    await sleep(1000);
    // Click Next slide button
    await client.send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('.pd-deck-slider__control-btn'));
        const nextBtn = btns.find(b => b.getAttribute('aria-label') === 'Next slide');
        if (nextBtn) nextBtn.click();
      `,
    });
    await sleep(1500);
    await waitForImages(client);
    await sleep(800);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '06-garageplug-deck-slide2-watermark.png'));

    // ─────────────────────────────────────────────────────────────
    // 4. Lacamino detail hero + deck watermark
    // ─────────────────────────────────────────────────────────────
    console.log('4. Capturing Lacamino detail hero (original PDF cover)...');
    await client.send('Page.navigate', { url: 'http://localhost:3000/work/lacamino' });
    await sleep(2500);
    await waitForImages(client);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '07-lacamino-detail-hero.png'));

    console.log('4b. Capturing Lacamino Deck Slide 2 (Watermark proof)...');
    await client.send('Runtime.evaluate', {
      expression: `
        const slider = document.querySelector('.pd-deck-slider');
        if (slider) slider.scrollIntoView({ block: 'center' });
      `,
    });
    await sleep(1000);
    await client.send('Runtime.evaluate', {
      expression: `
        const btns = Array.from(document.querySelectorAll('.pd-deck-slider__control-btn'));
        const nextBtn = btns.find(b => b.getAttribute('aria-label') === 'Next slide');
        if (nextBtn) nextBtn.click();
      `,
    });
    await sleep(1500);
    await waitForImages(client);
    await sleep(800);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '08-lacamino-deck-slide2-watermark.png'));

    // ─────────────────────────────────────────────────────────────
    // 5. Mobile /work grid (390x844)
    // ─────────────────────────────────────────────────────────────
    console.log('5. Capturing Mobile /work grid (390x844)...');
    await setViewport(client, 390, 844, true);
    await client.send('Page.navigate', { url: 'http://localhost:3000/work' });
    await sleep(2500);
    await waitForImages(client);
    await client.send('Runtime.evaluate', {
      expression: `
        const gp = document.querySelector('a[href="/work/garageplug"]');
        if (gp) gp.scrollIntoView({ block: 'start' });
      `,
    });
    await sleep(800);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '09-work-grid-mobile-garageplug.png'));

    await client.send('Runtime.evaluate', {
      expression: `
        const jmt = document.querySelector('a[href="/work/jmt"]');
        if (jmt) jmt.scrollIntoView({ block: 'start' });
      `,
    });
    await sleep(800);
    await captureScreenshot(client, path.join(SCREENSHOTS_DIR, '10-work-grid-mobile-jmt-lacamino.png'));

    client.close();
    console.log('All screenshots captured successfully!');
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});
