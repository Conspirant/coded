// Create minimal PNG icons
const fs = require('fs');

// Simple PNG header for a 144x144 blue square
const createSimplePNG = (size) => {
  // This is a minimal PNG file structure
  // PNG signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const width = size;
  const height = size;
  const bitDepth = 8;
  const colorType = 2; // RGB
  const compression = 0;
  const filter = 0;
  const interlace = 0;
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(bitDepth, 8);
  ihdrData.writeUInt8(colorType, 9);
  ihdrData.writeUInt8(compression, 10);
  ihdrData.writeUInt8(filter, 11);
  ihdrData.writeUInt8(interlace, 12);
  
  const ihdrCrc = require('crypto').createHash('crc32').update(Buffer.concat([Buffer.from('IHDR'), ihdrData])).digest();
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // Length
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);
  
  // IDAT chunk (minimal image data)
  const idatData = Buffer.alloc(size * size * 3);
  for (let i = 0; i < size * size * 3; i += 3) {
    idatData[i] = 59;     // R (blue-ish)
    idatData[i + 1] = 130; // G
    idatData[i + 2] = 246; // B
  }
  
  const idatCrc = require('crypto').createHash('crc32').update(Buffer.concat([Buffer.from('IDAT'), idatData])).digest();
  const idatChunk = Buffer.concat([
    Buffer.from([0, 0, 0, idatData.length]), // Length
    Buffer.from('IDAT'),
    idatData,
    idatCrc
  ]);
  
  // IEND chunk
  const iendCrc = require('crypto').createHash('crc32').update(Buffer.from('IEND')).digest();
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]), // Length
    Buffer.from('IEND'),
    iendCrc
  ]);
  
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
};

const sizes = [96, 144, 192, 512];
sizes.forEach(size => {
  const pngData = createSimplePNG(size);
  fs.writeFileSync(`public/icon-${size}x${size}.png`, pngData);
  console.log(`Created icon-${size}x${size}.png`);
});
