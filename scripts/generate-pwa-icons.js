// Simple script to create placeholder PWA icons
// In a real project, you would use proper icon generation tools

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.2}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">KC</text>
</svg>
`;

// Create placeholder icons
const sizes = [96, 144, 192, 512];

sizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `public/icon-${size}x${size}.png`;
  
  // For now, we'll create SVG files and note that they need to be converted to PNG
  const svgFilename = `public/icon-${size}x${size}.svg`;
  fs.writeFileSync(svgFilename, svg);
  
  console.log(`Created ${svgFilename} - Convert to PNG for production use`);
});

console.log('\nPWA Icons created!');
console.log('Note: Convert SVG files to PNG format for production use.');
console.log('You can use online tools like https://convertio.co/svg-png/ or ImageMagick.');
