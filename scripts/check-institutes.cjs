const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../public/data/cutoffs-2024.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

const institutes = new Set(data.map(item => item.institute));
const sortedInstitutes = Array.from(institutes).sort();

console.log("Total Institutes:", sortedInstitutes.length);
console.log("--------------------------------");
sortedInstitutes.forEach(inst => {
    if (inst.toLowerCase().includes('sai')) {
        console.log("MATCH FOUND:", inst);
    }
});
console.log("--------------------------------");
// Print first 10 just to verify
console.log("First 10 institutes:", sortedInstitutes.slice(0, 10));
