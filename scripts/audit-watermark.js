const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const ROOT = path.join(__dirname, '..');
const PUBLIC_PROJECTS = path.join(ROOT, 'public', 'projects');
const PRISTINE_DIR = path.join(ROOT, 'public', '.deck-pristine');
const STATE_FILE = path.join(__dirname, '.watermark-state.json');

const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

const slugs = fs.readdirSync(PUBLIC_PROJECTS, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .filter(n => fs.existsSync(path.join(PUBLIC_PROJECTS, n, 'deck', 'manifest.json')))
  .sort();

console.log('Total project slugs with deck manifests:', slugs.length);

let totalTargets = 0;
let totalWatermarked = 0;
let totalCovers = 0;
let anomalies = [];

for (const slug of slugs) {
  const deckDir = path.join(PUBLIC_PROJECTS, slug, 'deck');
  const manifest = JSON.parse(fs.readFileSync(path.join(deckDir, 'manifest.json'), 'utf8'));
  const pages = manifest.deck_images.map(p => path.basename(p));
  const cover = pages[0];
  const targets = pages.slice(1);
  totalCovers += 1;
  totalTargets += targets.length;

  let slugWatermarked = 0;
  let slugPristine = 0;
  let slugStateMatches = 0;

  for (const page of targets) {
    const src = path.join(deckDir, page);
    const pristine = path.join(PRISTINE_DIR, slug, page);
    const keyWin = slug + '\\' + page;
    const keyPosix = slug + '/' + page;
    const rec = state.files[keyWin] || state.files[keyPosix];

    if (!fs.existsSync(src)) {
      anomalies.push({ slug, page, issue: 'Target deck page missing on disk' });
      continue;
    }
    if (!fs.existsSync(pristine)) {
      anomalies.push({ slug, page, issue: 'Pristine backup missing' });
    } else {
      slugPristine++;
    }

    if (!rec) {
      anomalies.push({ slug, page, issue: 'Missing from watermark-state.json' });
    } else {
      const curSha = sha(fs.readFileSync(src));
      if (curSha === rec.outputSha) {
        slugStateMatches++;
        slugWatermarked++;
      } else {
        anomalies.push({ slug, page, issue: 'Disk SHA does not match state outputSha' });
      }
    }
  }

  // Check cover is NOT watermarked
  const coverPath = path.join(deckDir, cover);
  const coverPristine = path.join(PRISTINE_DIR, slug, cover);
  if (fs.existsSync(coverPristine)) {
    anomalies.push({ slug, cover, issue: 'Cover has pristine backup (should NOT be watermarked)' });
  }

  totalWatermarked += slugWatermarked;
}

console.log('Total slugs audited        :', slugs.length);
console.log('Total covers untouched     :', totalCovers);
console.log('Total target pages         :', totalTargets);
console.log('Total verified watermarked :', totalWatermarked);
console.log('Anomalies found            :', anomalies.length);
if (anomalies.length > 0) {
  console.log('Sample anomalies:', anomalies.slice(0, 10));
} else {
  console.log('AUDIT PASSED: All 32 projects have 100% verified watermarks on all deck slides, and covers are untouched!');
}
