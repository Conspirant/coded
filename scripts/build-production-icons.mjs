import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');

// Master 512x512 Production SVG
function generateMasterSvg(size = 512) {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icon-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#080C16" />
      <stop offset="60%" stop-color="#050811" />
      <stop offset="100%" stop-color="#010307" />
    </linearGradient>

    <!-- Top Arm Facet (Academic / High Rank Plane) -->
    <linearGradient id="top-facet-grad" x1="120" y1="120" x2="380" y2="240" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#93C5FD" />
      <stop offset="40%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>

    <!-- Left Spine Facet (Code Bracket < / Data Foundation) -->
    <linearGradient id="spine-facet-grad" x1="120" y1="200" x2="240" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#312E81" />
    </linearGradient>

    <!-- Bottom Arm Facet (Platform Baseline) -->
    <linearGradient id="base-facet-grad" x1="180" y1="300" x2="380" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>

    <!-- Inner Forward Prompt Chevron ( > Admission Compass Vector) -->
    <linearGradient id="core-chevron-grad" x1="280" y1="220" x2="380" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>

    <!-- Squircle Housing Border -->
    <linearGradient id="border-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
      <stop offset="45%" stop-color="rgba(255, 255, 255, 0.06)" />
      <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
    </linearGradient>

    <filter id="icon-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="28" flood-color="#4F46E5" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Housing Squircle -->
  <rect x="20" y="20" width="472" height="472" rx="120" fill="url(#icon-bg)" stroke="url(#border-grad)" stroke-width="4" />
  <rect x="26" y="26" width="460" height="460" rx="114" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1.5" />

  <g filter="url(#icon-glow)">
    <!-- 1. Top Arm Facet (Ascending Hexagon Upper Rim) -->
    <path d="M256 112 L384 186 L320 222 L224 168 L256 112 Z" fill="url(#top-facet-grad)" />

    <!-- 2. Left Spine Facet (Structural < Code Bracket) -->
    <path d="M224 168 L128 224 V288 L224 344 L224 276 L184 256 L224 232 Z" fill="url(#spine-facet-grad)" />

    <!-- 3. Bottom Arm Facet (Hexagon Lower Rim) -->
    <path d="M224 344 L256 400 L384 326 L320 290 L224 344 Z" fill="url(#base-facet-grad)" />

    <!-- 4. Forward Terminal Prompt Chevron ( > Admission Compass Vector ) -->
    <path d="M284 232 L344 256 L284 280 L298 290 L372 256 L298 222 Z" fill="url(#core-chevron-grad)" />
  </g>
</svg>
`;
}

// Master 64x64 SVG Favicon
const faviconSvg = `
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fav-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#080C16" />
      <stop offset="100%" stop-color="#010307" />
    </linearGradient>
    <linearGradient id="fav-top" x1="16" y1="16" x2="48" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#93C5FD" />
      <stop offset="40%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
    <linearGradient id="fav-spine" x1="16" y1="24" x2="30" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#312E81" />
    </linearGradient>
    <linearGradient id="fav-base" x1="24" y1="36" x2="48" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>
    <linearGradient id="fav-core" x1="34" y1="28" x2="48" y2="36" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>
  </defs>

  <rect width="64" height="64" rx="16" fill="url(#fav-bg)" />
  <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="rgba(255, 255, 255, 0.16)" stroke-width="1" />

  <g transform="translate(0, 0)">
    <!-- Top Arm -->
    <path d="M32 14 L48 23.25 L40 27.75 L28 21 L32 14 Z" fill="url(#fav-top)" />
    <!-- Spine -->
    <path d="M28 21 L16 28 V36 L28 43 L28 34.5 L23 32 L28 29 Z" fill="url(#fav-spine)" />
    <!-- Bottom Arm -->
    <path d="M28 43 L32 50 L48 40.75 L40 36.25 L28 43 Z" fill="url(#fav-base)" />
    <!-- Forward Prompt > -->
    <path d="M35.5 29 L43 32 L35.5 35 L37.25 36.25 L46.5 32 L37.25 27.75 Z" fill="url(#fav-core)" />
  </g>
</svg>
`;

async function buildAll() {
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg.trim());
  console.log('Generated public/favicon.svg');

  const masterBuf = Buffer.from(generateMasterSvg(512));
  const sizes = [16, 32, 96, 144, 192, 512];

  for (const size of sizes) {
    const filename = `icon-${size}x${size}.png`;
    await sharp(masterBuf)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(publicDir, filename));
    console.log(`Generated public/${filename}`);
  }

  await sharp(masterBuf).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(masterBuf).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Production assets generated successfully!');
}

buildAll().catch(console.error);
