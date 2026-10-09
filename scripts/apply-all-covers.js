const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const coversDir = path.join(__dirname, '../public/covers');
const projectsDir = path.join(__dirname, '../public/projects');

// Exact 18 source-to-target mappings based on ground truth visual audit
const conversions = [
  { source: 'Amarta Wisesa.png', targetSlug: 'amarta-wisesa' },
  { source: 'Ayam Goreng Nelongso.jpg', targetSlug: 'ayam-goreng-nelongso' },
  { source: 'BPR Artha Kanjuruhan.png', targetSlug: 'bpr-tulungagung', note: 'Visual text: PT BPR BANK TULUNGAGUNG' },
  { source: 'Pedoman Sistem Identitas .png', targetSlug: 'bpr-artha-kanjuruhan', note: 'Visual text: PT BANK PERKREDITAN RAKYAT ARTHA KANJURUHAN' },
  { source: 'Bank Sidoarjo.png', targetSlug: 'bank-sidoarjo' },
  { source: 'Boop Premium Pet Food.png', targetSlug: 'boop' },
  { source: 'Chatten.jpg', targetSlug: 'chatten' },
  { source: 'Cos Pleng.png', targetSlug: 'cos-pleng' },
  { source: 'Dailbana.png', targetSlug: 'dailbana' },
  { source: 'Dhika Universe.png', targetSlug: 'dhika-universe' },
  { source: 'Kopi 1922.png', targetSlug: 'gsm-1922' },
  { source: 'la tobas.png', targetSlug: 'latobas-cigar' },
  { source: 'Mem Sarasa.png', targetSlug: 'momsarasa' },
  { source: 'Mie Gacoan.jpg', targetSlug: 'mie-gacoan' },
  { source: 'PLUT KUMKM.png', targetSlug: 'plut-kumkm' },
  { source: 'ROHANI.png', targetSlug: 'rohani' },
  { source: 'SFI.png', targetSlug: 'sfi' },
  { source: 'Wajan Giok.jpg', targetSlug: 'wajan-giok' }
];

async function run() {
  console.log('--- EXECUTING HIGH QUALITY COVER CONVERSIONS ---');
  let success = 0;

  for (const c of conversions) {
    const srcPath = path.join(coversDir, c.source);
    const dstDir = path.join(projectsDir, c.targetSlug);
    const dstPath = path.join(dstDir, 'cover.webp');

    if (!fs.existsSync(srcPath)) {
      console.error(`Missing source: ${srcPath}`);
      continue;
    }
    if (!fs.existsSync(dstDir)) {
      fs.mkdirSync(dstDir, { recursive: true });
    }

    const meta = await sharp(srcPath).metadata();
    console.log(`Processing: [${c.source}] -> [${c.targetSlug}/cover.webp] (${meta.width}x${meta.height}) ${c.note || ''}`);

    await sharp(srcPath)
      .webp({ quality: 88 })
      .toFile(dstPath);

    const outStat = fs.statSync(dstPath);
    console.log(`  ✓ Converted -> ${outStat.size} bytes`);
    success++;
  }

  console.log(`\nSuccessfully converted ${success}/${conversions.length} covers.`);
}

run().catch(console.error);
