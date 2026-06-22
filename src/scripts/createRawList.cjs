const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../../public/colleges-list.json');
const outputPath = path.join(__dirname, '../data/collegesRawList.ts');

const rawData = fs.readFileSync(jsonPath, 'utf8');
const colleges = JSON.parse(rawData);

const tsContent = `// Auto-generated raw list of all 232+ KCET colleges
export interface RawCollege {
  code: string;
  name: string;
}

export const RAW_COLLEGES_LIST: RawCollege[] = ${JSON.stringify(colleges, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log('Successfully wrote raw colleges list to', outputPath);
