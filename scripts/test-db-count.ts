import { COLLEGE_DATABASE } from "../src/data/collegeDatabase";
import { RAW_COLLEGES_LIST } from "../src/data/collegesRawList";

console.log("=== DIAGNOSTIC REPORT ===");
console.log("RAW_COLLEGES_LIST length:", RAW_COLLEGES_LIST.length);
console.log("COLLEGE_DATABASE length:", COLLEGE_DATABASE.length);

const rawCodes = new Set(RAW_COLLEGES_LIST.map(c => c.code.toUpperCase()));
const dbCodes = new Set(COLLEGE_DATABASE.map(c => c.code.toUpperCase()));

console.log("Raw unique codes:", rawCodes.size);
console.log("DB unique codes:", dbCodes.size);

const missingInDb = [...rawCodes].filter(code => !dbCodes.has(code));
console.log("Missing in DB:", missingInDb);

// Check if any colleges in DB have null values for important fields
const nullFieldsCount = {
  established: 0,
  avgPackage: 0,
  maxPackage: 0,
  feeCetQuota: 0,
  website: 0
};

COLLEGE_DATABASE.forEach(c => {
  if (c.established === null) nullFieldsCount.established++;
  if (c.avgPackage === null) nullFieldsCount.avgPackage++;
  if (c.maxPackage === null) nullFieldsCount.maxPackage++;
  if (c.feeCetQuota === null) nullFieldsCount.feeCetQuota++;
  if (c.website === null) nullFieldsCount.website++;
});

console.log("Colleges with null fields:", nullFieldsCount);
