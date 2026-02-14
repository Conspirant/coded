const fs = require('fs');
const path = require('path');

// hardcoded absolute path to avoid cwd confusion
const filePath = 'c:\\Users\\risha\\OneDrive\\Desktop\\coded-main\\public\\kcet_cutoffs_consolidated.json';

try {
    console.log("Reading file from:", filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    let cutoffs = [];
    if (Array.isArray(data)) cutoffs = data;
    else if (data.data) cutoffs = data.data;
    else if (data.cutoffs) cutoffs = data.cutoffs;
    else {
        // Fallback for object with keys
        const keys = Object.keys(data);
        for (const k of keys) {
            if (Array.isArray(data[k]) && data[k].length > 1000) {
                cutoffs = data[k];
                break;
            }
        }
    }

    console.log(`Total records: ${cutoffs.length}`);

    // Filter for E173 and 2025
    const e173 = cutoffs.filter(c => c.institute_code === 'E173');
    console.log(`Total E173 Records (all years): ${e173.length}`);

    const e173_2025 = e173.filter(c => c.year === '2025');
    console.log(`E173 2025 Records: ${e173_2025.length}`);

    // Check Data Science courses
    const ds = e173_2025.filter(c => c.course && c.course.toLowerCase().includes('data'));
    console.log("\n--- Data Science Records (2025) ---");
    ds.forEach(c => console.log(JSON.stringify(c)));

    if (ds.length === 0) {
        console.log("No 'Data' courses found in 2025 for E173. Listing ALL 2025 courses:");
        const courses = [...new Set(e173_2025.map(c => c.course))];
        console.log(courses);
    }

    // Check Round 3 / Extended
    const r3 = e173_2025.filter(c => c.round && (c.round.toLowerCase().includes('ext') || c.round.toLowerCase().includes('round 3')));
    console.log("\n--- E173 2025 R3/Extended Sample ---");
    r3.slice(0, 5).forEach(c => console.log(JSON.stringify(c)));

} catch (e) {
    console.error("Error:", e.message);
}
