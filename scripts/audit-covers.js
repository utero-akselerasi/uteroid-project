const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = path.resolve(__dirname, '..');
const projectsTsPath = path.join(rootDir, 'lib', 'projects.ts');
const publicDir = path.join(rootDir, 'public');
const coversDir = path.join(publicDir, 'covers');
const projectsDir = path.join(publicDir, 'projects');

// Read lib/projects.ts
const content = fs.readFileSync(projectsTsPath, 'utf8');

// Parse projects from projects.ts
// We can use a regex to match project objects
const projectBlocks = content.split(/\n\s*\{\s*\n\s*slug:\s*["']/);
const projects = [];

// Skip first chunk before first project
for (let i = 1; i < projectBlocks.length; i++) {
  const block = 'slug: "' + projectBlocks[i];
  
  const getField = (field) => {
    const match = block.match(new RegExp(`${field}:\\s*["']([^"']+)["']`));
    return match ? match[1] : undefined;
  };

  const slug = getField('slug');
  const title = getField('title');
  const coverImage = getField('coverImage');
  const heroImage = getField('heroImage');
  const homepageCoverImage = getField('homepageCoverImage');
  const hoverImage = getField('hoverImage');
  
  projects.push({
    slug,
    title,
    coverImage,
    heroImage,
    homepageCoverImage,
    hoverImage,
  });
}

async function audit() {
  console.log(`=== AUDIT REPORT: PROJECTS (${projects.length} total) ===\n`);

  const coversInDir = fs.readdirSync(coversDir);
  console.log(`Files in public/covers/ (${coversInDir.length} files):`);
  for (const f of coversInDir) {
    const stat = fs.statSync(path.join(coversDir, f));
    let meta = {};
    try {
      meta = await sharp(path.join(coversDir, f)).metadata();
    } catch (e) {}
    console.log(`  - ${f} (${(stat.size / 1024).toFixed(1)} KB, ${meta.width || '?'}x${meta.height || '?'}, ${meta.format || '?'})`);
  }
  console.log('\n');

  console.log('Project Status:');
  const brokenReferences = [];
  const deckCoverProjects = [];
  const customCoverProjects = [];

  for (const p of projects) {
    const coverPath = p.coverImage ? path.join(publicDir, p.coverImage.replace(/^\//, '')) : null;
    const heroPath = p.heroImage ? path.join(publicDir, p.heroImage.replace(/^\//, '')) : null;
    const homepageCoverPath = p.homepageCoverImage ? path.join(publicDir, p.homepageCoverImage.replace(/^\//, '')) : null;

    const coverExists = coverPath ? fs.existsSync(coverPath) : false;
    const heroExists = heroPath ? fs.existsSync(heroPath) : false;
    const hpExists = homepageCoverPath ? fs.existsSync(homepageCoverPath) : true;

    // Check if /public/projects/[slug]/cover.webp exists
    const projectCoverWebp = path.join(projectsDir, p.slug, 'cover.webp');
    const projectCoverWebpExists = fs.existsSync(projectCoverWebp);
    const backupExists = fs.existsSync(path.join(projectsDir, p.slug, 'cover.webp.backup'));

    // Check if deck 001 exists
    const deck001 = path.join(projectsDir, p.slug, 'deck', '001.webp');
    const deck001Exists = fs.existsSync(deck001);

    if (!coverExists) {
      brokenReferences.push({ project: p.slug, field: 'coverImage', path: p.coverImage });
    }
    if (!heroExists) {
      brokenReferences.push({ project: p.slug, field: 'heroImage', path: p.heroImage });
    }
    if (p.homepageCoverImage && !hpExists) {
      brokenReferences.push({ project: p.slug, field: 'homepageCoverImage', path: p.homepageCoverImage });
    }

    const isDeck = p.coverImage && p.coverImage.includes('/deck/');
    if (isDeck) {
      deckCoverProjects.push(p.slug);
    } else {
      customCoverProjects.push(p.slug);
    }

    console.log(`[${p.slug}] "${p.title}"`);
    console.log(`  coverImage: ${p.coverImage} (exists: ${coverExists})`);
    console.log(`  heroImage: ${p.heroImage} (exists: ${heroExists})`);
    if (p.homepageCoverImage) {
      console.log(`  homepageCoverImage: ${p.homepageCoverImage} (exists: ${hpExists})`);
    }
    console.log(`  projects/${p.slug}/cover.webp exists: ${projectCoverWebpExists} (backup: ${backupExists})`);
    console.log(`  projects/${p.slug}/deck/001.webp exists: ${deck001Exists}`);
    console.log('');
  }

  console.log(`Summary:`);
  console.log(`Total projects: ${projects.length}`);
  console.log(`Broken references: ${brokenReferences.length}`);
  if (brokenReferences.length > 0) {
    console.log('BROKEN REFERENCES DETECTED:');
    brokenReferences.forEach(b => console.log(`  - ${b.project}: ${b.field} -> ${b.path}`));
  } else {
    console.log('  Zero broken references detected in lib/projects.ts!');
  }
  console.log(`Cover type: ${customCoverProjects.length} use cover.webp, ${deckCoverProjects.length} use deck/001.webp`);
}

audit().catch(console.error);
