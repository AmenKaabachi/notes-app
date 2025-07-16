const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFaviconIco() {
  try {
    const svgBuffer = fs.readFileSync(path.join(__dirname, 'public', 'favicon.svg'));
    
    // Convert SVG to PNG at different sizes and create ICO
    const png16 = await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toBuffer();
    
    const png32 = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    const png48 = await sharp(svgBuffer)
      .resize(48, 48)
      .png()
      .toBuffer();
    
    // For now, just save the 32x32 as favicon.ico (most browsers will use SVG anyway)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, 'public', 'favicon.ico'));
    
    // Also create PNG versions for apple-touch-icon
    await sharp(fs.readFileSync(path.join(__dirname, 'public', 'apple-touch-icon.svg')))
      .resize(180, 180)
      .png()
      .toFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));
      
    console.log('✅ Favicon and icons created successfully!');
  } catch (error) {
    console.error('❌ Error creating favicon:', error);
  }
}

createFaviconIco();
