const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const content = fs.readFileSync(path.join(rootDir, 'lib', 'projects.ts'), 'utf8');
const projectBlocks = content.split(/\n\s*\{\s*\n\s*slug:\s*["']/);

function getHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

const results = [];

for (let i = 1; i < projectBlocks.length; i++) {
  const block = 'slug: "' + projectBlocks[i];
  const slug = block.match(/slug:\s*["']([^"']+)["']/)[1];
  const title = block.match(/title:\s*["']([^"']+)["']/)[1];
  const coverImage = block.match(/coverImage:\s*["']([^"']+)["']/)[1];
  const heroImage = block.match(/heroImage:\s*["']([^"']+)["']/)[1];
  const hpMatch = block.match(/homepageCoverImage:\s*["']([^"']+)["']/);
  const hpCover = hpMatch ? hpMatch[1] : null;

  const actualCoverPath = path.join(rootDir, 'public', coverImage.replace(/^\//, ''));
  const actualCoverExists = fs.existsSync(actualCoverPath);

  const deck001Path = path.join(rootDir, 'public', 'projects', slug, 'deck', '001.webp');
  const deck001Exists = fs.existsSync(deck001Path);

  const coverHash = getHash(actualCoverPath);
  const deckHash = getHash(deck001Path);

  const isSameAsDeck001 = coverHash && deckHash && coverHash === deckHash;
  const backupPath = path.join(rootDir, 'public', 'projects', slug, 'cover.webp.backup');
  const hasBackup = fs.existsSync(backupPath);

  const coverStat = actualCoverExists ? fs.statSync(actualCoverPath) : null;

  results.push({
    index: i,
    slug,
    title,
    coverImage,
    actualCoverExists,
    coverSize: coverStat ? coverStat.size : 0,
    coverMtime: coverStat ? coverStat.mtime.toISOString() : null,
    isSameAsDeck001,
    hasBackup,
    hpCover
  });
}

console.log(JSON.stringify(results, null, 2));
