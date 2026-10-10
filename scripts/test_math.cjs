const katex = require('katex');

const sFixed = 'Resistivity $\\rho = \\frac{m}{n e^2 \\tau} = [M L^3 T^{-3} A^{-2}]$.\\nConductivity $\\sigma = \\frac{1}{\\rho} = [M^{-1} L^{-2} T^3 A^2]$.\\nHence, $[M^{-1}L^{-2}T^3A^2]$ represents electrical conductivity.';
let text = sFixed.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
const parts = text.split(mathRegex);

console.log('Parts count:', parts.length);
parts.forEach((p, i) => {
  if (!p) return;
  if (p.startsWith('$') && p.endsWith('$')) {
    const math = p.slice(1, -1).trim();
    console.log(`[Math ${i}]: "${math}" => OK`);
  } else {
    console.log(`[Text ${i}]: "${p}"`);
  }
});
