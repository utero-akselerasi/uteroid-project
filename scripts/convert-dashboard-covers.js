const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'JMT.png',
  'garageplus.png', 
  'lacamino.png',
  'maitri.png'
];

const inputDir = path.join(__dirname, '../public/projects/dashboard-covers');
const outputDir = inputDir;

async function convertImage(filename) {
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, filename.replace('.png', '.webp'));
  
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`Converted ${filename} to WebP`);
  } catch (error) {
    console.error(`Error converting ${filename}:`, error);
  }
}

async function main() {
  for (const image of images) {
    await convertImage(image);
  }
  console.log('All conversions complete!');
}

main().catch(console.error);
