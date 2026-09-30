const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PUBLIC_PROJECTS = path.join(ROOT, 'public', 'projects');
const WATERMARK_SRC = path.join(ROOT, 'public', 'img', 'watermark.png');
const PRISTINE_DIR = path.join(ROOT, 'public', '.deck-pristine');
const STATE_FILE = path.join(__dirname, '.watermark-state.json');

const OPACITY = 0.08;
const WATERMARK_WIDTH_RATIO = 0.32;
const WEBP_QUALITY = 78;
const WEBP_EFFORT = 5;
const TOOL_VERSION = 1;

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const APPLY = has('--apply');
const FORCE = has('--force');
const SLUG_FILTER = val('--slug', null);
const LIMIT = parseInt(val('--limit', '0'), 10);
const CONCURRENCY = parseInt(val('--concurrency', '4'), 10);

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const mib = (b) => (b / 1048576).toFixed(2);

function listSlugs() {
  return fs
    .readdirSync(PUBLIC_PROJECTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => fs.existsSync(path.join(PUBLIC_PROJECTS, n, 'deck', 'manifest.json')))
    .filter((n) => (SLUG_FILTER ? n === SLUG_FILTER : true))
    .sort();
}

function buildPlan() {
  const plan = [];
  for (const slug of listSlugs()) {
    const deckDir = path.join(PUBLIC_PROJECTS, slug, 'deck');
    const manifest = JSON.parse(fs.readFileSync(path.join(deckDir, 'manifest.json'), 'utf8'));
    const pages = manifest.deck_images.map((p) => path.basename(p));
    const cover = pages[0];
    if (!cover) continue;
    for (const file of pages) {
      plan.push({
        slug,
        file,
        isCover: file === cover,
        src: path.join(deckDir, file),
        pristine: path.join(PRISTINE_DIR, slug, file),
      });
    }
  }
  return plan;
}

async function buildWatermark() {
  const { data, info } = await sharp(WATERMARK_SRC)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels < 3) throw new Error('watermark must have >=3 channels, got ' + channels);
  const rgba = Buffer.alloc(width * height * 4);
  let maxAlpha = 0;
  for (let i = 0, p = 0; i < width * height; i++, p += channels) {
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const alpha = Math.round((255 - Math.min(r, g, b)) * OPACITY);
    const o = i * 4;
    rgba[o] = r;
    rgba[o + 1] = g;
    rgba[o + 2] = b;
    rgba[o + 3] = alpha;
    if (alpha > maxAlpha) maxAlpha = alpha;
  }
  return { buf: rgba, width, height, maxAlpha };
}

async function render(wm, srcPath) {
  const meta = await sharp(srcPath).metadata();
  const w = Math.max(1, Math.round(meta.width * WATERMARK_WIDTH_RATIO));
  const h = Math.max(1, Math.round(w * (wm.height / wm.width)));
  const mark = await sharp(wm.buf, { raw: { width: wm.width, height: wm.height, channels: 4 } })
    .resize({ width: w, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const left = Math.round((meta.width - w) / 2);
  const top = Math.round((meta.height - h) / 2);
  return sharp(srcPath)
    .composite([{ input: mark, left, top, blend: 'over' }])
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT, smartSubsample: true })
    .toBuffer();
}

async function pool(items, worker, n) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      for (;;) {
        const i = cursor++;
        if (i >= items.length) return;
        results[i] = await worker(items[i], i);
      }
    })
  );
  return results;
}

async function main() {
  if (!fs.existsSync(WATERMARK_SRC)) throw new Error('missing watermark: ' + WATERMARK_SRC);
  const plan = buildPlan();
  if (!plan.length) throw new Error('no deck pages found' + (SLUG_FILTER ? ' for slug ' + SLUG_FILTER : ''));

  const state = fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : { version: TOOL_VERSION, files: {} };
  const wm = await buildWatermark();
  const wmSha = sha(fs.readFileSync(WATERMARK_SRC));

  const covers = plan.filter((p) => p.isCover);
  const targets = plan.filter((p) => !p.isCover);
  const limited = LIMIT ? targets.slice(0, LIMIT) : targets;

  console.log('mode              :', APPLY ? 'APPLY' : 'DRY-RUN');
  console.log('slugs             :', listSlugs().length);
  console.log('deck pages        :', plan.length);
  console.log('covers (skipped)  :', covers.length);
  console.log('to watermark      :', limited.length);
  console.log('watermark         :', wm.width + 'x' + wm.height, '| max alpha', wm.maxAlpha + '/255 (' + ((wm.maxAlpha / 255) * 100).toFixed(1) + '%)');
  console.log('placement         : centered, width ' + WATERMARK_WIDTH_RATIO * 100 + '% of page');
  console.log('webp              : quality ' + WEBP_QUALITY + ', effort ' + WEBP_EFFORT);
  console.log('');

  let before = 0;
  let after = 0;
  let skipped = 0;
  let seeded = 0;
  let errors = 0;
  let done = 0;
  const t0 = Date.now();

  const results = await pool(limited, async (item) => {
    if (!fs.existsSync(item.src)) {
      errors++;
      return { item, error: 'source missing' };
    }
    const curBytes = fs.readFileSync(item.src);
    before += curBytes.length;

    let basePath = item.src;
    if (fs.existsSync(item.pristine)) {
      basePath = item.pristine;
    } else {
      const rec = state.files[path.join(item.slug, item.file)];
      if (!FORCE && rec && rec.outputSha === sha(curBytes) && rec.watermarkSha === wmSha) {
        skipped++;
        return { item, skipped: true };
      }
      if (APPLY) {
        fs.mkdirSync(path.dirname(item.pristine), { recursive: true });
        fs.copyFileSync(item.src, item.pristine);
        seeded++;
      }
    }

    try {
      const out = await render(wm, basePath);
      after += out.length;
      if (APPLY) {
        const tmp = item.src + '.tmp';
        fs.writeFileSync(tmp, out);
        fs.renameSync(tmp, item.src);
        state.files[path.join(item.slug, item.file)] = {
          sourceSha: sha(fs.readFileSync(item.pristine)),
          outputSha: sha(out),
          watermarkSha: wmSha,
          opacity: OPACITY,
          ratio: WATERMARK_WIDTH_RATIO,
          quality: WEBP_QUALITY,
          version: TOOL_VERSION,
        };
      }
      return { item, bytes: out.length };
    } catch (e) {
      errors++;
      return { item, error: e.message };
    } finally {
      done++;
      if (done % 100 === 0 || done === limited.length) {
        const pct = ((done / limited.length) * 100).toFixed(0);
        process.stdout.write('\r  ' + done + '/' + limited.length + ' (' + pct + '%)   ');
      }
    }
  }, CONCURRENCY);

  process.stdout.write('\n\n');

  if (APPLY) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  }

  const errs = results.filter((r) => r && r.error);

  console.log('pristine seeded   :', seeded);
  console.log('already applied   :', skipped, '(use --force to redo)');
  console.log('errors            :', errors);
  console.log('elapsed           :', ((Date.now() - t0) / 1000).toFixed(1) + 's');
  console.log('');

  const pct = (a, b) => (b ? (((a - b) / b) * 100).toFixed(1) + '%' : 'n/a');
  const signed = (a, b) => (a - b >= 0 ? '+' : '') + mib(a - b) + ' MB';

  if (!APPLY) {
    console.log('watermarked pages before :', mib(before), 'MB');
    console.log('watermarked pages after  :', mib(after), 'MB  (estimated)');
    console.log('delta                    :', signed(after, before), '(' + pct(after, before) + ')');
  } else {
    let wmBefore = 0;
    let wmAfter = 0;
    for (const r of results) {
      if (!r || r.skipped || r.error) continue;
      wmAfter += r.bytes;
      wmBefore += fs.statSync(r.item.pristine).size;
    }
    let deckTotal = 0;
    let thumbTotal = 0;
    for (const s of listSlugs()) {
      const deckDir = path.join(PUBLIC_PROJECTS, s, 'deck');
      for (const f of fs.readdirSync(deckDir)) {
        if (f.endsWith('.webp')) deckTotal += fs.statSync(path.join(deckDir, f)).size;
      }
      const t = path.join(deckDir, 'thumbs');
      if (fs.existsSync(t)) {
        for (const f of fs.readdirSync(t)) thumbTotal += fs.statSync(path.join(t, f)).size;
      }
    }
    console.log('watermarked pages before :', mib(wmBefore), 'MB  (pristine, this run)');
    console.log('watermarked pages after  :', mib(wmAfter), 'MB');
    console.log('delta                    :', signed(wmAfter, wmBefore), '(' + pct(wmAfter, wmBefore) + ')');
    console.log('');
    console.log('deck pages now (945 wm + 32 covers):', mib(deckTotal), 'MB');
    console.log('thumbs (untouched)                :', mib(thumbTotal), 'MB');
    console.log('deck asset folder total           :', mib(deckTotal + thumbTotal), 'MB');
  }
  if (errs.length) {
    console.log('\nERRORS:');
    for (const e of errs.slice(0, 20)) console.log('  ', e.item.slug + '/' + e.item.file, '->', e.error);
  }
}

main().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
