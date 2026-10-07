const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const coversDir = path.join(__dirname, '../public/covers');
const projectsDir = path.join(__dirname, '../public/projects');

const replacements = [
  { source: 'Amarta Wisesa.png', targetSlug: 'amarta-wisesa' },
  { source: 'Ayam Goreng Nelongso.jpg', targetSlug: 'ayam-goreng-nelongso' },
  { source: 'BPR Artha Kanjuruhan.png', targetSlug: 'bpr-artha-kanjuruhan' },
  { source: 'Bank Sidoarjo.jpg', targetSlug: 'bank-sidoarjo' },
  { source: 'Boop Premium Pet Food.png', targetSlug: 'boop' },
  { source: 'Chatten.jpg', targetSlug: 'chatten' },
  { source: 'Cos Pleng.png', targetSlug: 'cos-pleng' },
  { source: 'Dailbana.png', targetSlug: 'dailbana' },
  { source: 'Dhika Universe.png', targetSlug: 'dhika-universe' },
  { source: 'Kopi 1922.png', targetSlug: 'gsm-1922' },
  { source: 'La Tobas Cigar.jpg', targetSlug: 'latobas-cigar' },
  { source: 'Mem Sarasa.png', targetSlug: 'momsarasa' },
  { source: 'Mie Gacoan.jpg', targetSlug: 'mie-gacoan' },
  { source: 'PLUT KUMKM.png', targetSlug: 'plut-kumkm' },
  { source: 'ROHANI.png', targetSlug: 'rohani' },
  { source: 'SFI.jpg', targetSlug: 'sfi' },
  { source: 'Wajan Giok.jpg', targetSlug: 'wajan-giok' },
];

async function convertCover(sourceFile, targetSlug) {
  const sourcePath = path.join(coversDir, sourceFile);
  const targetDir = path.join(projectsDir, targetSlug);
  const targetPath = path.join(targetDir, 'cover.webp');

  // Check if source exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return false;
  }

  // Ensure target directory exists
  if (!fs.existsSync(targetDir)) {
    console.error(`Target directory not found: ${targetDir}`);
    return false;
  }

  try {
    // Get image metadata
    const metadata = await sharp(sourcePath).metadata();
    console.log(`Processing ${sourceFile} -> ${targetSlug}/cover.webp (${metadata.width}x${metadata.height})`);

    // Backup existing cover if it exists
    if (fs.existsSync(targetPath)) {
      const backupPath = path.join(targetDir, 'cover.webp.backup');
      fs.copyFileSync(targetPath, backupPath);
      console.log(`  - Backed up existing cover to cover.webp.backup`);
    }

    // Convert to WebP with quality 85 (matching existing pattern)
    await sharp(sourcePath)
      .webp({ quality: 85 })
      .toFile(targetPath);

    console.log(`  ✓ Converted successfully`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error converting ${sourceFile}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting cover image conversion...\n');

  let successCount = 0;
  let failCount = 0;

  for (const replacement of replacements) {
    const success = await convertCover(replacement.source, replacement.targetSlug);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\nConversion complete: ${successCount} succeeded, ${failCount} failed`);
}

main().catch(console.error);
