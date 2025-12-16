import fs from 'fs'
import path from 'path'

async function testConsolidatedData() {
  try {
    console.log('Testing consolidated data structure...')
    
    const dataPath = path.join(process.cwd(), 'public', 'kcet_cutoffs_consolidated.json')
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    
    console.log('✅ Data loaded successfully')
    console.log(`📊 Total entries: ${data.metadata.total_entries.toLocaleString()}`)
    console.log(`📅 Years: ${data.metadata.years.join(', ')}`)
    console.log(`🏛️  Institutes: ${data.metadata.unique_institutes.length}`)
    console.log(`📚 Courses: ${data.metadata.unique_courses.length}`)
    console.log(`🏷️  Categories: ${data.metadata.categories.length}`)
    console.log(`🔄 Rounds: ${data.metadata.rounds.join(', ')}`)
    console.log(`📁 Sources: ${data.metadata.sources.join(', ')}`)
    
    // Test sample entries
    const sampleEntries = data.cutoffs.slice(0, 5)
    console.log('\n📋 Sample entries:')
    sampleEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.institute_code} - ${entry.course} (${entry.category}) - Rank: ${entry.cutoff_rank}`)
    })
    
    // Verify data integrity
    const invalidEntries = data.cutoffs.filter(entry => 
      !entry.institute || 
      !entry.institute_code || 
      !entry.course || 
      !entry.category || 
      !entry.cutoff_rank || 
      !entry.year || 
      !entry.round
    )
    
    if (invalidEntries.length > 0) {
      console.log(`⚠️  Found ${invalidEntries.length} invalid entries`)
      console.log('Sample invalid entry:', invalidEntries[0])
    } else {
      console.log('✅ All entries have valid structure')
    }
    
    // Check for duplicate entries
    const entryKeys = data.cutoffs.map(entry => 
      `${entry.institute_code}-${entry.course}-${entry.category}-${entry.year}-${entry.round}`
    )
    const uniqueKeys = new Set(entryKeys)
    
    if (entryKeys.length !== uniqueKeys.size) {
      console.log(`⚠️  Found ${entryKeys.length - uniqueKeys.size} duplicate entries`)
    } else {
      console.log('✅ No duplicate entries found')
    }
    
    // Test course name normalization
    const coursesWithNewlines = data.cutoffs.filter(entry => entry.course.includes('\n'))
    if (coursesWithNewlines.length > 0) {
      console.log(`⚠️  Found ${coursesWithNewlines.length} courses with newlines`)
      console.log('Sample:', coursesWithNewlines[0].course)
    } else {
      console.log('✅ All course names are properly normalized')
    }
    
    // Test institute name normalization
    const institutesWithColon = data.cutoffs.filter(entry => entry.institute.startsWith(':'))
    if (institutesWithColon.length > 0) {
      console.log(`⚠️  Found ${institutesWithColon.length} institutes with leading colon`)
      console.log('Sample:', institutesWithColon[0].institute)
    } else {
      console.log('✅ All institute names are properly normalized')
    }
    
    console.log('\n🎉 Consolidated data test completed successfully!')
    
  } catch (error) {
    console.error('❌ Error testing consolidated data:', error)
    process.exit(1)
  }
}

testConsolidatedData()
