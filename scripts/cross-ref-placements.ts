import { PLACEMENT_DATA } from "../src/lib/college-placements";
import { getCollegeInfo } from "../src/data/collegeDatabase";

console.log("=== PLACEMENT DATA CROSS-REFERENCE ===");
console.log("Total entries in PLACEMENT_DATA:", PLACEMENT_DATA.length);

const missingCodes: string[] = [];
PLACEMENT_DATA.forEach(p => {
  const info = getCollegeInfo(p.code);
  if (!info) {
    console.log(`Code ${p.code} (${p.name}) completely missing from COLLEGE_DATABASE!`);
  } else {
    // Check if the placement packages match or are close
    if (info.avgPackage !== p.avgPackage || info.maxPackage !== p.maxPackage) {
      console.log(`Mismatch for ${p.code} (${p.name}):`);
      console.log(`  PLACEMENT_DATA: Avg=${p.avgPackage}, Max=${p.maxPackage}`);
      console.log(`  COLLEGE_DATABASE: Avg=${info.avgPackage}, Max=${info.maxPackage}`);
    }
  }
});
