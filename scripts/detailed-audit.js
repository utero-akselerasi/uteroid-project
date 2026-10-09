const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const coversDir = path.join(rootDir, 'public', 'covers');
const projectsDir = path.join(rootDir, 'public', 'projects');

// Files currently in public/covers
const coverFiles = fs.readdirSync(coversDir);

console.log('=== ALL FILES IN public/covers ===');
coverFiles.forEach(f => {
  const stat = fs.statSync(path.join(coversDir, f));
  console.log(`${f} (${stat.size} bytes, modified: ${stat.mtime.toISOString()})`);
});

// Let's analyze each cover file and identify target project slug
const mapping = [
  { file: 'Amarta Wisesa.png', expectedSlug: 'amarta-wisesa' },
  { file: 'Ayam Goreng Nelongso.jpg', expectedSlug: 'ayam-goreng-nelongso' },
  { file: 'BPR Artha Kanjuruhan.png', expectedSlug: 'bpr-tulungagung', notes: 'Image explicitly says PT BPR BANK TULUNGAGUNG' },
  { file: 'Pedoman Sistem Identitas .png', expectedSlug: 'bpr-artha-kanjuruhan', notes: 'Image explicitly says PT BANK PERKREDITAN RAKYAT ARTHA KANJURUHAN' },
  { file: 'Bank Sidoarjo.png', expectedSlug: 'bank-sidoarjo' },
  { file: 'Boop Premium Pet Food.png', expectedSlug: 'boop' },
  { file: 'Chatten.jpg', expectedSlug: 'chatten' },
  { file: 'Cos Pleng.png', expectedSlug: 'cos-pleng' },
  { file: 'Dailbana.png', expectedSlug: 'dailbana' },
  { file: 'Dhika Universe.png', expectedSlug: 'dhika-universe' },
  { file: 'Kopi 1922.png', expectedSlug: 'gsm-1922' },
  { file: 'la tobas.png', expectedSlug: 'latobas-cigar' },
  { file: 'Mem Sarasa.png', expectedSlug: 'momsarasa' },
  { file: 'Mie Gacoan.jpg', expectedSlug: 'mie-gacoan' },
  { file: 'PLUT KUMKM.png', expectedSlug: 'plut-kumkm' },
  { file: 'ROHANI.png', expectedSlug: 'rohani' },
  { file: 'SFI.png', expectedSlug: 'sfi' },
  { file: 'Wajan Giok.jpg', expectedSlug: 'wajan-giok' }
];

async function checkConversions() {
  console.log('\n=== CHECKING CONVERSIONS FOR ALL 18 COVERS ===');
  for (const m of mapping) {
    const sourcePath = path.join(coversDir, m.file);
    const targetPath = path.join(projectsDir, m.expectedSlug, 'cover.webp');
    const targetExists = fs.existsSync(targetPath);
    
    // Check if target is webp, what its dimensions are, and if source has newer mtime
    const srcStat = fs.statSync(sourcePath);
    const srcMeta = await sharp(sourcePath).metadata();

    let tgtMeta = null;
    let tgtStat = null;
    let isNewerThanTgt = false;
    if (targetExists) {
      tgtStat = fs.statSync(targetPath);
      tgtMeta = await sharp(targetPath).metadata();
      isNewerThanTgt = srcStat.mtimeMs > tgtStat.mtimeMs;
    }

    console.log(`\nSource: ${m.file} -> Target: ${m.expectedSlug}/cover.webp`);
    if (m.notes) console.log(`  NOTE: ${m.notes}`);
    console.log(`  Source: ${srcMeta.width}x${srcMeta.height}, ${srcStat.size} bytes, mtime: ${srcStat.mtime.toISOString()}`);
    if (targetExists) {
      console.log(`  Target: ${tgtMeta.width}x${tgtMeta.height}, ${tgtStat.size} bytes, mtime: ${tgtStat.mtime.toISOString()}`);
      console.log(`  Source newer than Target? ${isNewerThanTgt ? 'YES (needs reconversion!)' : 'No'}`);
    } else {
      console.log(`  Target DOES NOT EXIST!`);
    }
  }
}

checkConversions().catch(console.error);
