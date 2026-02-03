
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../public/data/kcet_cutoffs_consolidated.json');
const outputDir = path.join(__dirname, '../public/data');

try {
    console.log('Reading large JSON file...');
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    const cutoffs = data.cutoffs || data;
    console.log(`Total records: ${cutoffs.length}`);

    const byYear = {};

    cutoffs.forEach(item => {
        const year = item.year;
        if (!byYear[year]) byYear[year] = [];
        byYear[year].push(item);
    });

    Object.keys(byYear).forEach(year => {
        const yearData = byYear[year];
        const outputFile = path.join(outputDir, `cutoffs-${year}.json`);

        // Sort slightly to ensure consistency
        yearData.sort((a, b) => a.institute_code.localeCompare(b.institute_code));

        fs.writeFileSync(outputFile, JSON.stringify(yearData));
        console.log(`Saved ${year}: ${yearData.length} records to ${path.basename(outputFile)}`);
    });

} catch (e) {
    console.error('Error splitting file:', e);
}
