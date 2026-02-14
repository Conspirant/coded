const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public/kcet_cutoffs_consolidated.json');

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    let cutoffs = [];
    if (Array.isArray(data)) cutoffs = data;
    else if (data.data) cutoffs = data.data;
    else if (data.cutoffs) cutoffs = data.cutoffs;

    console.log(`Total records: ${cutoffs.length}`);

    // Filter for E173 and 2025
    const e173_2025 = cutoffs.filter(c => c.institute_code === 'E173' && c.year === '2025');
    console.log(`E173 2025 Records: ${e173_2025.length}`);

    // Check Data Science courses
    const ds = e173_2025.filter(c => c.course.toLowerCase().includes('data'));
    console.log("\n--- Data Science Records (2025) ---");
    ds.forEach(c => console.log(JSON.stringify(c)));

    // Check Round 3 / Extended
    const r3 = e173_2025.filter(c => c.round.toLowerCase().includes('ext') || c.round.toLowerCase().includes('round 3'));
    console.log("\n--- R3/Extended Records (2025) ---");
    r3.slice(0, 10).forEach(c => console.log(JSON.stringify(c)));

} catch (e) {
    console.error(e);
}
