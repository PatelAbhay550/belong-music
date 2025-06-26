const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/LOGO.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`Error generating icon-${size}x${size}.png:`, error);
    }
  }
  
  console.log('PWA icons generated successfully!');
}

// Only run if this file is executed directly
if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = generateIcons;
