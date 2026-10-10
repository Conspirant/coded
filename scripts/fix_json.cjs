const fs = require('fs');

const path = 'src/data/pyq_physics_ch1_ch2.json';
const list = JSON.parse(fs.readFileSync(path, 'utf-8'));

// Fix question 1 explanation
list[0].explanation = "Resistivity $\\rho = \\frac{m}{n e^2 \\tau} = [M L^3 T^{-3} A^{-2}]$\\n\\nConductivity $\\sigma = \\frac{1}{\\rho} = [M^{-1} L^{-2} T^3 A^2]$\\n\\nHence, $[M^{-1}L^{-2}T^3A^2]$ represents electrical conductivity.";

fs.writeFileSync(path, JSON.stringify(list, null, 2), 'utf-8');
console.log('Fixed Q1 explanation in', path);
