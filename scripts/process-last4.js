const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projects = [
  {
    slug: 'biskuat',
    sourceDir: 'C:/Users/hamam/Downloads/last4/BISKUAT',
    deckFiles: [
      'IMG_9554.JPG',
      'IMG_9555.JPG',
      'IMG_9556.JPG',
      'IMG_9557.JPG',
      'IMG_9558.JPG',
      'IMG_9559.JPG',
      'IMG_9560.JPG',
      'IMG_9561.JPG',
      'IMG_9562.JPG'
    ],
    galleryFiles: [
      'IMG_9554.JPG',
      'IMG_9555.JPG',
      'IMG_9559.JPG',
      'IMG_9562.JPG'
    ]
  },
  {
    slug: 'kapal-api',
    sourceDir: 'C:/Users/hamam/Downloads/last4/KAPAL API',
    deckFiles: [
      '12692788-549F-4176-9948-9E30F4B5F16E.jpg',
      '29FD2870-B707-4C8E-A6AC-7EBAFABEBEE3.jpg',
      'F5BAA221-BAD1-4E96-BF44-AF3FFC3EC07B.jpg',
      '7269FFBC-126C-4C20-9AA0-E28337A87006.jpg',
      'IMG_9709.PNG',
      'IMG_9712.PNG',
      'IMG_9715.PNG',
      'IMG_9716.PNG'
    ],
    galleryFiles: [
      'IMG_9709.PNG',
      '7269FFBC-126C-4C20-9AA0-E28337A87006.jpg',
      'IMG_9715.PNG',
      'IMG_9716.PNG'
    ]
  },
  {
    slug: 'sedral',
    sourceDir: 'C:/Users/hamam/Downloads/last4/SEDRAL',
    deckFiles: [
      'IMG_9824.PNG',
      'IMG_9822.PNG',
      'IMG_9819.PNG',
      'IMG_9821.PNG',
      'IMG_9820.PNG',
      'IMG_9823.PNG',
      'IMG_9825.PNG'
    ],
    galleryFiles: [
      'IMG_9819.PNG',
      'IMG_9820.PNG',
      'IMG_9821.PNG',
      'IMG_9825.PNG'
    ]
  },
  {
    slug: 'tolakangin',
    sourceDir: 'C:/Users/hamam/Downloads/last4/TOLAKANGIN',
    deckFiles: [
      'IMG_9671.PNG',
      'IMG_9672.PNG',
      'IMG_9673.PNG',
      'IMG_9674.PNG',
      'IMG_9675.PNG',
      'IMG_9676.PNG',
      'IMG_9677.PNG'
    ],
    galleryFiles: [
      'IMG_9671.PNG',
      'IMG_9672.PNG',
      'IMG_9673.PNG',
      'IMG_9675.PNG'
    ]
  }
];

async function run() {
  for (const proj of projects) {
    console.log(`\nProcessing ${proj.slug}...`);
    const projPublicDir = path.join(__dirname, '..', 'public', 'projects', proj.slug);
    const deckDir = path.join(projPublicDir, 'deck');
    const thumbsDir = path.join(deckDir, 'thumbs');
    const galleryDir = path.join(projPublicDir, 'gallery');

    fs.mkdirSync(deckDir, { recursive: true });
    fs.mkdirSync(thumbsDir, { recursive: true });
    fs.mkdirSync(galleryDir, { recursive: true });

    // 1. Process deck slides & thumbnails
    const deckImages = [];
    const aspectRatios = [];
    const thumbnails = [];

    for (let i = 0; i < proj.deckFiles.length; i++) {
      const srcFile = path.join(proj.sourceDir, proj.deckFiles[i]);
      const slideNum = String(i + 1).padStart(3, '0');
      const slideFilename = `${slideNum}.webp`;
      const slidePath = path.join(deckDir, slideFilename);
      const thumbPath = path.join(thumbsDir, slideFilename);

      const metadata = await sharp(srcFile).metadata();
      const ar = metadata.width / metadata.height;
      aspectRatios.push(Number(ar.toFixed(10)));
      deckImages.push(`/projects/${proj.slug}/deck/${slideFilename}`);
      thumbnails.push(`/projects/${proj.slug}/deck/thumbs/${slideFilename}`);

      // Generate slide (max height 1600 or max width 1600)
      await sharp(srcFile)
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(slidePath);

      // Generate thumb (width 120)
      await sharp(srcFile)
        .resize({ width: 120, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(thumbPath);

      console.log(`  Slide ${slideNum} done (${metadata.width}x${metadata.height}, AR: ${ar.toFixed(3)})`);
    }

    // Write manifest.json
    const manifest = {
      slug: proj.slug,
      total_pages: proj.deckFiles.length,
      deck_images: deckImages,
      aspect_ratios: aspectRatios,
      thumbnails: thumbnails
    };
    fs.writeFileSync(path.join(deckDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`  Wrote deck/manifest.json (${proj.deckFiles.length} pages)`);

    // 2. Process gallery images (000.webp, 001.webp, 002.webp, 003.webp)
    for (let i = 0; i < proj.galleryFiles.length; i++) {
      const srcFile = path.join(proj.sourceDir, proj.galleryFiles[i]);
      const galleryFilename = `${String(i).padStart(3, '0')}.webp`;
      const targetPath = path.join(galleryDir, galleryFilename);

      await sharp(srcFile)
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(targetPath);

      console.log(`  Gallery ${galleryFilename} created from ${proj.galleryFiles[i]}`);
    }
  }

  console.log('\nAll 4 projects processed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

