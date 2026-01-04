import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { glob } from 'glob';

// College mapping from the PDF data
const COLLEGE_MAPPING = {
  'E001': { name: 'University of Visvesvaraya College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E002': { name: 'S K S J T Institute of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E003': { name: 'B M S College of Engineering', location: 'Basavanagudi, Bangalore', district: 'Bangalore Urban' },
  'E004': { name: 'Dr. Ambedkar Institute Of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E005': { name: 'R. V. College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E006': { name: 'P E S University', location: 'Bangalore', district: 'Bangalore Urban' },
  'E007': { name: 'B M S Institute of Technology and Management', location: 'Bangalore', district: 'Bangalore Urban' },
  'E008': { name: 'M S Ramaiah Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E009': { name: 'Bangalore Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E010': { name: 'P E S Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E011': { name: 'S J C Institute of Technology', location: 'Chikkaballapur', district: 'Chikkaballapur' },
  'E012': { name: 'B N M Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E013': { name: 'Dayananda Sagar College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E014': { name: 'B M S College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E015': { name: 'R N S Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E016': { name: 'S J C Institute of Technology', location: 'Chikkaballapur', district: 'Chikkaballapur' },
  'E017': { name: 'B N M Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E018': { name: 'Dayananda Sagar College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E019': { name: 'B M S College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E020': { name: 'R N S Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' }
};

// Branch mapping from the PDF data
const BRANCH_MAPPING = {
  'AI': { name: 'Artificial Intelligence', code: 'AI' },
  'AR': { name: 'Architecture', code: 'AR' },
  'CE': { name: 'Civil Engineering', code: 'CE' },
  'CS': { name: 'Computer Science Engineering', code: 'CS' },
  'EC': { name: 'Electronics and Communication Engineering', code: 'EC' },
  'EE': { name: 'Electrical and Electronics Engineering', code: 'EE' },
  'IE': { name: 'Information Science Engineering', code: 'IE' },
  'ME': { name: 'Mechanical Engineering', code: 'ME' },
  'ST': { name: 'Silk Technology', code: 'ST' },
  'TX': { name: 'Textile Technology', code: 'TX' },
  'BT': { name: 'Bio Technology', code: 'BT' },
  'CA': { name: 'Computer Science Engineering-AI', code: 'CA' },
  'CH': { name: 'Chemical Engineering', code: 'CH' },
  'CY': { name: 'Computer Science Engineering-Cyber', code: 'CY' },
  'DS': { name: 'Computer Science Engineering-Data Science', code: 'DS' },
  'EI': { name: 'Electronics and Instrumentation Engineering', code: 'EI' },
  'ET': { name: 'Electronics and Telecommunication Engineering', code: 'ET' },
  'IM': { name: 'Industrial Engineering and Management', code: 'IM' }
};

// Category mapping
const CATEGORY_MAPPING = {
  '1G': '1G',
  '2A': '2A',
  '2B': '2B',
  '3A': '3A',
  '3B': '3B',
  'GM': 'GM',
  'SC': 'SC',
  'ST': 'ST'
};

function parseCutoffData(text, year, source) {
  const lines = text.split(/\r?\n/);
  const results = [];

  let currentCollege = null;
  let currentBranches = [];
  let inDataSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Detect college header (E001, E002, etc.)
    if (line.toLowerCase().includes('sai vidya')) {
      console.log(`DEBUG: Found Sai Vidya line: '${line}'`);
      console.log(`DEBUG: Regex match result:`, line.match(/^(E\d{3})\s+(.+?)$/));
    }
    const collegeMatch = line.match(/^(E\d{3})\s+(.+?)$/);
    if (collegeMatch) {
      const code = collegeMatch[1];
      const fullName = collegeMatch[2].trim();

      // Try to extract location (usually at the end)
      let name = fullName;
      let location = 'Karnataka'; // Default
      let district = 'Karnataka';

      // Heuristic: Last word or comma separated part might be location
      if (fullName.includes(',')) {
        const parts = fullName.split(',');
        location = parts.pop().trim();
        name = parts.join(',').trim();
      } else {
        // Just take the whole string as name for now
        name = fullName;
      }

      currentCollege = {
        code: code,
        name: name,
        location: location,
        district: district
      };

      console.log(`Found college: ${code} - ${name}`);
      currentBranches = [];
      inDataSection = false;
      continue;
    }

    // Detect branch names (usually 2-3 letter codes)
    if (currentCollege && !inDataSection) {
      const branchMatch = line.match(/^([A-Z]{2,3})\s+(.+)$/);
      if (branchMatch) {
        const branchCode = branchMatch[1];
        const branchName = branchMatch[2].trim();
        if (BRANCH_MAPPING[branchCode]) {
          currentBranches.push({
            code: branchCode,
            name: BRANCH_MAPPING[branchCode].name
          });
        }
      }

      // Check if this line contains category headers
      if (line.includes('1G1K1R2AG2AK2AR2BG2BK2BR3AG3AK3AR3BG3BK3BRGMGMKGMRSCGSCKSCRSTGSTKSTR')) {
        inDataSection = true;
        continue;
      }
    }

    // Parse data rows
    if (currentCollege && inDataSection && /\d/.test(line)) {
      // Skip header repetition
      if (line.includes('1G1K1R2AG2AK2AR2BG2BK2BR3AG3AK3AR3BG3BK3BRGMGMKGMRSCGSCKSCRSTGSTKSTR')) {
        continue;
      }

      // Parse the data line - it contains category-wise closing ranks
      const categories = ['1G', '2A', '2B', '3A', '3B', 'GM', 'SC', 'ST'];
      const dataParts = line.split(/(\d{2,6})/).filter(Boolean);

      // Extract closing ranks for each category
      let categoryIndex = 0;
      for (let j = 0; j < dataParts.length && categoryIndex < categories.length; j++) {
        const part = dataParts[j].trim();
        if (/^\d{2,6}$/.test(part)) {
          const closingRank = parseInt(part);
          if (closingRank > 0 && closingRank < 200000) { // Reasonable rank range
            const category = categories[categoryIndex];
            const branchIndex = Math.floor(categoryIndex / categories.length * currentBranches.length);
            const branch = currentBranches[branchIndex] || currentBranches[0];

            if (branch) {
              results.push({
                id: `${year}-${currentCollege.code}-${branch.code}-${category}-${Math.random().toString(36).slice(2, 8)}`,
                year: parseInt(year),
                category: category,
                seat_type: 'government',
                quota_type: 'general',
                round: 1,
                opening_rank: null,
                closing_rank: closingRank,
                seats_available: null,
                source_url: source,
                verified: false,
                colleges: {
                  name: currentCollege.name,
                  code: currentCollege.code,
                  location: currentCollege.location,
                  district: currentCollege.district
                },
                branches: {
                  name: branch.name,
                  code: branch.code
                }
              });
            }
            categoryIndex++;
          }
        }
      }
    }
  }

  return results;
}

async function extractFromPdf(file) {
  try {
    const buf = fs.readFileSync(file);
    const data = await pdf(buf);
    const text = data.text || '';

    // Detect year from filename
    const yearMatch = file.match(/20\d{2}/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();

    // Parse the cutoff data
    const results = parseCutoffData(text, year, path.basename(file));

    console.log(`Extracted ${results.length} records from ${path.basename(file)}`);
    return results;
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    return [];
  }
}

async function main() {
  const root = process.cwd();
  const pdfs = await glob('*.pdf', { cwd: root });

  if (!pdfs.length) {
    console.error('No PDFs found in project root.');
    process.exit(1);
  }

  console.log(`Found ${pdfs.length} PDF files to process`);

  const allResults = [];

  for (const pdfFile of pdfs) {
    try {
      const results = await extractFromPdf(path.join(root, pdfFile));
      allResults.push(...results);
    } catch (error) {
      console.error(`Failed to process ${pdfFile}:`, error.message);
    }
  }

  // Create output directory
  const outDir = path.join(root, 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });

  // Save the extracted data
  const outFile = path.join(outDir, 'cutoffs.json');
  fs.writeFileSync(outFile, JSON.stringify(allResults, null, 2));

  console.log(`\nExtraction complete!`);
  console.log(`Total records extracted: ${allResults.length}`);
  console.log(`Data saved to: ${outFile}`);

  // Generate summary statistics
  const yearStats = {};
  const collegeStats = {};
  const branchStats = {};

  allResults.forEach(record => {
    // Year stats
    yearStats[record.year] = (yearStats[record.year] || 0) + 1;

    // College stats
    const collegeCode = record.colleges.code;
    collegeStats[collegeCode] = (collegeStats[collegeCode] || 0) + 1;

    // Branch stats
    const branchCode = record.branches.code;
    branchStats[branchCode] = (branchStats[branchCode] || 0) + 1;
  });

  console.log('\nSummary Statistics:');
  console.log('By Year:', yearStats);
  console.log('Top Colleges:', Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 5));
  console.log('Top Branches:', Object.entries(branchStats).sort((a, b) => b[1] - a[1]).slice(0, 5));
}

main().catch((error) => {
  console.error('Extraction failed:', error);
  process.exit(1);
});


