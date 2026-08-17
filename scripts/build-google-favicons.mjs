import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');

// Master SVG
function generateMasterSvg(size = 512) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icon-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#080C16" />
      <stop offset="60%" stop-color="#050811" />
      <stop offset="100%" stop-color="#010307" />
    </linearGradient>

    <!-- Top Arm Facet -->
    <linearGradient id="top-facet-grad" x1="120" y1="120" x2="380" y2="240" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#93C5FD" />
      <stop offset="40%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>

    <!-- Left Spine Facet (Code Bracket <) -->
    <linearGradient id="spine-facet-grad" x1="120" y1="200" x2="240" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#312E81" />
    </linearGradient>

    <!-- Bottom Arm Facet -->
    <linearGradient id="base-facet-grad" x1="180" y1="300" x2="380" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <!-- Inner Forward Prompt Chevron (>) -->
    <linearGradient id="core-chevron-grad" x1="280" y1="220" x2="380" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>

    <linearGradient id="border-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
      <stop offset="45%" stop-color="rgba(255, 255, 255, 0.06)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
    </linearGradient>

    <filter id="icon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="28" flood-color="#4F46E5" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect x="20" y="20" width="472" height="472" rx="120" fill="url(#icon-bg)" stroke="url(#border-grad)" stroke-width="4" />
  <rect x="26" y="26" width="460" height="460" rx="114" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1.5" />

  <g filter="url(#icon-glow)">
    <path d="M256 112 L384 186 L320 222 L224 168 L256 112 Z" fill="url(#top-facet-grad)" />
    <path d="M224 168 L128 224 V288 L224 344 L224 276 L184 256 L224 232 Z" fill="url(#spine-facet-grad)" />
    <path d="M224 344 L256 400 L384 326 L320 290 L224 344 Z" fill="url(#base-facet-grad)" />
    <path d="M284 232 L344 256 L284 280 L298 290 L372 256 L298 222 Z" fill="url(#core-chevron-grad)" />
  </g>
</svg>
`;
}

// Function to create a valid multi-size ICO file containing PNG streams (Vista+ PNG in ICO format)
function createIcoFromPngs(pngBuffers) {
  // ICO Header: 6 bytes
  // Reserved: 2 bytes (0)
  // Type: 2 bytes (1 for ICO)
  // Count: 2 bytes (number of images)
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    
    dirEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(p => p.buffer)]);
}

async function main() {
  const masterBuf = Buffer.from(generateMasterSvg(512));

  // Generate Google-specific multiples of 48px and standard web sizes
  const sizes = [16, 32, 48, 96, 144, 180, 192, 512];
  const pngMap = {};

  for (const size of sizes) {
    const buf = await sharp(masterBuf)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();
    
    pngMap[size] = buf;
    const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`;
    fs.writeFileSync(path.join(publicDir, filename), buf);
    console.log(`Generated public/${filename}`);
  }

  // Generate public/favicon.png (32x32)
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), pngMap[32]);

  // Generate public/favicon.ico with 16, 32, 48
  const icoBuffer = createIcoFromPngs([
    { size: 16, buffer: pngMap[16] },
    { size: 32, buffer: pngMap[32] },
    { size: 48, buffer: pngMap[48] },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated public/favicon.ico (Multi-size 16/32/48 ICO)');
}

main().catch(console.error);
