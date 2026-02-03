import fs from 'fs';
import path from 'path';

async function consolidateCutoffs() {
  try {
    console.log('Starting consolidation of KCET cutoffs data...');
    
    // Read JSON files
    console.log('Reading kcet_cutoffs.json...');
    const cutoffs2023_2024 = JSON.parse(fs.readFileSync('kcet_cutoffs.json', 'utf8'));
    
    console.log('Reading kcet_cutoffs2025.json...');
    const cutoffs2025 = JSON.parse(fs.readFileSync('kcet_cutoffs2025.json', 'utf8'));
    
    // Try to read the new Round 3 2025 file if present
    let cutoffs2025R3 = { cutoffs: [], metadata: {} };
    const r3Path = 'kcet_cutoffs_round3_2025.json';
    if (fs.existsSync(r3Path)) {
      console.log('Reading kcet_cutoffs_round3_2025.json...');
      try {
        cutoffs2025R3 = JSON.parse(fs.readFileSync(r3Path, 'utf8'));
      } catch (e) {
        console.warn('Warning: Failed to parse kcet_cutoffs_round3_2025.json, skipping.');
      }
    } else {
      console.log('kcet_cutoffs_round3_2025.json not found, proceeding without it.');
    }
    
    console.log(`2023-2024 data: ${cutoffs2023_2024.cutoffs.length} records`);
    console.log(`2025 data: ${cutoffs2025.cutoffs.length} records`);
    
    // Consolidate the data from the cutoffs arrays (include R3 2025 if available)
    const consolidatedCutoffs = [
      ...((cutoffs2023_2024.cutoffs) || []),
      ...((cutoffs2025.cutoffs) || []),
      ...((cutoffs2025R3.cutoffs) || [])
    ];
    
    // Create consolidated metadata
    const consolidatedMetadata = {
      last_updated: new Date().toISOString(),
      total_entries: consolidatedCutoffs.length,
      total_institutes: Math.max(cutoffs2023_2024.metadata?.total_institutes || 0, cutoffs2025.metadata?.total_institutes || 0),
      total_courses: Math.max(cutoffs2023_2024.metadata?.total_courses || 0, cutoffs2025.metadata?.total_courses || 0),
      total_categories: Math.max(cutoffs2023_2024.metadata?.total_categories || 0, cutoffs2025.metadata?.total_categories || 0),
      years_covered: ["2023", "2024", "2025"],
      extraction_method: "Consolidated from multiple sources",
      source_files: [
        "kcet_cutoffs.json",
        "kcet_cutoffs2025.json",
        ...(cutoffs2025R3.cutoffs?.length ? ["kcet_cutoffs_round3_2025.json"] : [])
      ]
    };
    
    // Create the consolidated structure
    const consolidatedData = {
      metadata: consolidatedMetadata,
      cutoffs: consolidatedCutoffs
    };
    
    console.log(`Consolidated data: ${consolidatedCutoffs.length} total records`);
    
    // Create the consolidated file
    const outputPath = 'kcet_cutoffs_consolidated.json';
    fs.writeFileSync(outputPath, JSON.stringify(consolidatedData, null, 2));
    
    console.log(`✅ Successfully created ${outputPath}`);
    console.log(`📊 Total records: ${consolidatedCutoffs.length}`);
    
    // Also copy to public/data directory if it exists
    const publicDataPath = 'public/data/kcet_cutoffs_consolidated.json';
    if (fs.existsSync('public/data')) {
      fs.writeFileSync(publicDataPath, JSON.stringify(consolidatedData, null, 2));
      console.log(`✅ Also saved to ${publicDataPath}`);
    }
    
    // Create a backup of the original files
    const backupDir = 'backup';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }
    
    fs.copyFileSync('kcet_cutoffs.json', path.join(backupDir, 'kcet_cutoffs_backup.json'));
    fs.copyFileSync('kcet_cutoffs2025.json', path.join(backupDir, 'kcet_cutoffs2025_backup.json'));
    console.log(`✅ Backups created in ${backupDir}/ directory`);
    
    // Replace the main file with consolidated version
    fs.copyFileSync(outputPath, 'kcet_cutoffs.json');
    console.log(`✅ Replaced main kcet_cutoffs.json with consolidated version`);
    
  } catch (error) {
    console.error('❌ Error during consolidation:', error.message);
    process.exit(1);
  }
}

// Run the consolidation
consolidateCutoffs();
