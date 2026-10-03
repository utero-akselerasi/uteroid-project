const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

const ROOT = path.join(__dirname, '..');
const PUBLIC_PROJECTS = path.join(ROOT, 'public', 'projects');
const PRISTINE_DIR = path.join(ROOT, 'public', '.deck-pristine');
const STATE_FILE = path.join(__dirname, '.watermark-state.json');

// Decks that arrive already watermarked in the source PDF (or were stamped to
// match the delivered decks) and are rendered directly into the deck format.
// They intentionally have no pristine backup and no watermark-state entry, so
// they are exempt from the pristine/SHA checks below.
const MANUALLY_WATERMARKED = new Set([
  // 31 replaced decks rendered from pre-watermarked PDFs in "public/pdf slides"
  'amarta-wisesa', 'ayam-goreng-nelongso', 'baiturrohman', 'bank-sidoarjo', 'boop',
  'bpr-artha-kanjuruhan', 'bpr-tulungagung', 'chatten', 'cos-pleng', 'dailbana',
  'garageplug', 'gsm-1922', 'jmt', 'kiyona', 'konas-2021', 'lacamino', 'maitri',
  'mcc', 'mie-gacoan', 'momsarasa', 'plut-kumkm', 'proxon', 'rohani', 'satu-titik',
  'sfi', 'stamford', 'techlink', 'uwg', 'wajan-giok', 'wismari', 'yin-yam',
  // new decks: logo-73 stamped to match; latobas & dhika watermarked at source
  'logo-73-indonesia', 'latobas-cigar', 'dhika-universe',
]);

let state = { version: 1, files: {} };
try {
  state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
} catch {
  // state file is optional once all decks are manually watermarked
}
state.files = state.files || {};

const slugs = fs.readdirSync(PUBLIC_PROJECTS, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .filter(n => fs.existsSync(path.join(PUBLIC_PROJECTS, n, 'deck', 'manifest.json')))
  .sort();

console.log('Total project slugs with deck manifests:', slugs.length);

let totalPages = 0;
let manuallyWatermarked = 0;
let verified = 0;
let exemptSlugs = 0;
let anomalies = [];

for (const slug of slugs) {
  const deckDir = path.join(PUBLIC_PROJECTS, slug, 'deck');
  const manifest = JSON.parse(fs.readFileSync(path.join(deckDir, 'manifest.json'), 'utf8'));
  const pages = manifest.deck_images.map(p => path.basename(p));
  totalPages += pages.length;

  // Every page referenced by the manifest must exist on disk.
  for (const page of pages) {
    if (!fs.existsSync(path.join(deckDir, page))) {
      anomalies.push({ slug, page, issue: 'Deck page missing on disk' });
    }
  }

  if (MANUALLY_WATERMARKED.has(slug)) {
    // Watermarked at the source: no pristine backup / state entry expected.
    exemptSlugs++;
    manuallyWatermarked += pages.length;
    continue;
  }

  // Legacy automated-watermark checks: cover is untouched, every other page
  // must have a pristine backup and a matching state entry.
  const cover = pages[0];
  const targets = pages.slice(1);

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
    }
    if (!rec) {
      anomalies.push({ slug, page, issue: 'Missing from watermark-state.json' });
    } else if (sha(fs.readFileSync(src)) === rec.outputSha) {
      verified++;
    } else {
      anomalies.push({ slug, page, issue: 'Disk SHA does not match state outputSha' });
    }
  }

  const coverPristine = path.join(PRISTINE_DIR, slug, cover);
  if (fs.existsSync(coverPristine)) {
    anomalies.push({ slug, page: cover, issue: 'Cover has pristine backup (should NOT be watermarked)' });
  }
}

console.log('Total slugs audited             :', slugs.length);
console.log('  manually watermarked (exempt) :', exemptSlugs);
console.log('Total deck pages                :', totalPages);
console.log('  covered by manual watermark   :', manuallyWatermarked);
console.log('  verified via pristine/state   :', verified);
console.log('Anomalies found                 :', anomalies.length);
if (anomalies.length > 0) {
  console.log('Sample anomalies:', anomalies.slice(0, 10));
} else {
  console.log('AUDIT PASSED: every deck page exists and all watermarked decks are accounted for.');
}
