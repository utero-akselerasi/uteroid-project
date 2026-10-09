const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const content = fs.readFileSync(path.join(rootDir, 'lib', 'projects.ts'), 'utf8');
const projectBlocks = content.split(/\n\s*\{\s*\n\s*slug:\s*["']/);

const mappedSlugs = {
  'amarta-wisesa': 'Amarta Wisesa.png',
  'ayam-goreng-nelongso': 'Ayam Goreng Nelongso.jpg',
  'bpr-tulungagung': 'BPR Artha Kanjuruhan.png (mislabeled, actually Bank Tulungagung)',
  'bpr-artha-kanjuruhan': 'Pedoman Sistem Identitas .png (actually Artha Kanjuruhan)',
  'bank-sidoarjo': 'Bank Sidoarjo.png (replaces Bank Sidoarjo.jpg)',
  'boop': 'Boop Premium Pet Food.png',
  'chatten': 'Chatten.jpg',
  'cos-pleng': 'Cos Pleng.png',
  'dailbana': 'Dailbana.png (updated file)',
  'dhika-universe': 'Dhika Universe.png',
  'gsm-1922': 'Kopi 1922.png',
  'latobas-cigar': 'la tobas.png (replaces La Tobas Cigar.jpg)',
  'momsarasa': 'Mem Sarasa.png',
  'mie-gacoan': 'Mie Gacoan.jpg',
  'plut-kumkm': 'PLUT KUMKM.png',
  'rohani': 'ROHANI.png',
  'sfi': 'SFI.png (replaces SFI.jpg)',
  'wajan-giok': 'Wajan Giok.jpg'
};

const fourConflictProjects = ['garageplug', 'jmt', 'lacamino', 'maitri'];

console.log('=== ALL 34 PROJECTS IN lib/projects.ts ===\n');

for (let i = 1; i < projectBlocks.length; i++) {
  const block = 'slug: "' + projectBlocks[i];
  const slug = block.match(/slug:\s*["']([^"']+)["']/)[1];
  const title = block.match(/title:\s*["']([^"']+)["']/)[1];
  const coverImage = block.match(/coverImage:\s*["']([^"']+)["']/)[1];
  const heroImage = block.match(/heroImage:\s*["']([^"']+)["']/)[1];
  const hpMatch = block.match(/homepageCoverImage:\s*["']([^"']+)["']/);
  const hpCover = hpMatch ? hpMatch[1] : null;

  const inCovers = mappedSlugs[slug];
  const is4Conflict = fourConflictProjects.includes(slug);

  console.log(`${i.toString().padStart(2, '0')}. [${slug}] "${title}"`);
  console.log(`    coverImage: ${coverImage}`);
  console.log(`    heroImage:  ${heroImage}`);
  if (hpCover) {
    console.log(`    homepageCoverImage: ${hpCover}`);
  }
  if (is4Conflict) {
    console.log(`    ★ Part of 4-conflict projects (uses homepageCoverImage)`);
  }
  if (inCovers) {
    console.log(`    → In public/covers: ${inCovers}`);
  } else {
    console.log(`    → Not in public/covers`);
  }
  console.log('');
}
