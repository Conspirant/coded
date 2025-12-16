import fs from 'fs'
import path from 'path'

// Function to normalize course names by removing newlines and extra spaces
function normalizeCourseName(courseName) {
  if (!courseName) return ''
  return courseName
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Function to normalize institute names
function normalizeInstituteName(instituteName) {
  if (!instituteName) return ''
  return instituteName
    .replace(/^:\s*/, '') // Remove leading colon and spaces
    .replace(/^College:\s*/, '') // Remove "College:" prefix
    .replace(/\s+/g, ' ')
    .trim()
}

// Function to normalize cutoff data entry
function normalizeCutoffEntry(entry, source) {
  return {
    institute: normalizeInstituteName(entry.institute || entry.institute_name || ''),
    institute_code: (entry.institute_code || '').toString().trim().toUpperCase(),
    course: normalizeCourseName(entry.course || ''),
    category: (entry.category || '').toString().trim(),
    cutoff_rank: Number(entry.cutoff_rank || 0),
    year: (entry.year || '').toString().trim(),
    round: (entry.round || '').toString().trim(),
    source: source // Track which file the data came from
  }
}

async function mergeDataSources() {
  try {
    console.log('Starting to merge data sources...')
    
    // Read the main data files
    const kcetCutoffsPath = path.join(process.cwd(), 'kcet_cutoffs.json')
    const kcetCutoffs2025Path = path.join(process.cwd(), 'kcet_cutoffs2025.json')
    
    console.log('Reading kcet_cutoffs.json...')
    const kcetCutoffsData = JSON.parse(fs.readFileSync(kcetCutoffsPath, 'utf8'))
    
    console.log('Reading kcet_cutoffs2025.json...')
    const kcetCutoffs2025Data = JSON.parse(fs.readFileSync(kcetCutoffs2025Path, 'utf8'))
    
    // Extract and normalize data from both sources
    const normalizedCutoffs = []
    
    // Process kcet_cutoffs.json data
    if (kcetCutoffsData.cutoffs && Array.isArray(kcetCutoffsData.cutoffs)) {
      console.log(`Processing ${kcetCutoffsData.cutoffs.length} entries from kcet_cutoffs.json`)
      kcetCutoffsData.cutoffs.forEach(entry => {
        const normalized = normalizeCutoffEntry(entry, 'kcet_cutoffs')
        if (normalized.institute && normalized.course && normalized.cutoff_rank > 0) {
          normalizedCutoffs.push(normalized)
        }
      })
    }
    
    // Process kcet_cutoffs2025.json data
    if (kcetCutoffs2025Data.cutoffs && Array.isArray(kcetCutoffs2025Data.cutoffs)) {
      console.log(`Processing ${kcetCutoffs2025Data.cutoffs.length} entries from kcet_cutoffs2025.json`)
      kcetCutoffs2025Data.cutoffs.forEach(entry => {
        const normalized = normalizeCutoffEntry(entry, 'kcet_cutoffs2025')
        if (normalized.institute && normalized.course && normalized.cutoff_rank > 0) {
          normalizedCutoffs.push(normalized)
        }
      })
    }
    
    console.log(`Total normalized entries: ${normalizedCutoffs.length}`)
    
    // Extract unique values for metadata
    const uniqueYears = [...new Set(normalizedCutoffs.map(entry => entry.year))].sort((a, b) => b.localeCompare(a))
    const uniqueCategories = [...new Set(normalizedCutoffs.map(entry => entry.category))].sort()
    const uniqueCourses = [...new Set(normalizedCutoffs.map(entry => entry.course))].sort()
    const uniqueInstitutes = [...new Set(normalizedCutoffs.map(entry => entry.institute))].sort()
    const uniqueRounds = [...new Set(normalizedCutoffs.map(entry => entry.round))].sort()
    
    // Create consolidated data structure
    const consolidatedData = {
      metadata: {
        extraction_date: new Date().toISOString(),
        total_entries: normalizedCutoffs.length,
        files_processed: 2,
        unique_courses: uniqueCourses,
        unique_institutes: uniqueInstitutes,
        categories: uniqueCategories,
        years: uniqueYears,
        rounds: uniqueRounds,
        sources: ['kcet_cutoffs.json', 'kcet_cutoffs2025.json']
      },
      cutoffs: normalizedCutoffs
    }
    
    // Write consolidated data to public directory
    const outputPath = path.join(process.cwd(), 'public', 'kcet_cutoffs_consolidated.json')
    fs.writeFileSync(outputPath, JSON.stringify(consolidatedData, null, 2))
    
    console.log(`Consolidated data written to: ${outputPath}`)
    console.log(`Total entries: ${consolidatedData.metadata.total_entries}`)
    console.log(`Unique courses: ${uniqueCourses.length}`)
    console.log(`Unique institutes: ${uniqueInstitutes.length}`)
    console.log(`Years: ${uniqueYears.join(', ')}`)
    console.log(`Rounds: ${uniqueRounds.join(', ')}`)
    
    // Also create a backup in the root directory
    const backupPath = path.join(process.cwd(), 'kcet_cutoffs_consolidated.json')
    fs.writeFileSync(backupPath, JSON.stringify(consolidatedData, null, 2))
    console.log(`Backup written to: ${backupPath}`)
    
  } catch (error) {
    console.error('Error merging data sources:', error)
    process.exit(1)
  }
}

mergeDataSources()
