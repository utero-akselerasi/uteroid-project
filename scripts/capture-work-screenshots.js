const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9223; // use separate port to avoid conflicts
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
      '--user-data-dir=' + path.join(__dirname, '..', 'scratch', 'chrome-profile-work'),
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

async function captureFullPage(client, filepath, width, isMobile = false) {
  // Navigate
  await client.send('Page.navigate', { url: 'http://localhost:3000/work' });
  await sleep(2500);

  // Set initial viewport
  await client.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: isMobile,
  });

  // Scroll down progressively to trigger any lazy loading of images
  const { result: heightRes } = await client.send('Runtime.evaluate', {
    expression: 'document.body.scrollHeight',
    returnByValue: true
  });
  const totalHeight = heightRes.value || 4000;

  for (let y = 0; y < totalHeight; y += 600) {
    await client.send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${y}, behavior: 'instant' })`
    });
    await sleep(200);
  }
  await client.send('Runtime.evaluate', {
    expression: "window.scrollTo({ top: 0, behavior: 'instant' })"
  });
  await sleep(1500);

  // Capture full screenshot
  const { data } = await client.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  });
  fs.writeFileSync(filepath, Buffer.from(data, 'base64'));
  console.log(`Saved screenshot: ${path.basename(filepath)} (${fs.statSync(filepath).size} bytes)`);
}

async function run() {
  console.log('Starting Chrome...');
  const chromeProc = await startChrome();

  try {
    const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.ready();
    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Runtime.enable');

    console.log('1. Capturing 1440px desktop full work page...');
    await captureFullPage(client, path.join(SCREENSHOTS_DIR, 'work-full-1440px.png'), 1440, false);

    console.log('2. Capturing 390px mobile full work page...');
    await captureFullPage(client, path.join(SCREENSHOTS_DIR, 'work-full-390px.png'), 390, true);

    client.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch(console.error);
