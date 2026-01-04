#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function moveXLSXFiles() {
  const rootDir = path.resolve(__dirname, '..')
  const publicDir = path.join(rootDir, 'public')
  
  console.log('Moving XLSX files to public directory...')
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  // List of XLSX files to move
  const xlsxFiles = [
    'kcet-2023-round1-cutoffs.xlsx',
    'kcet-2023-round2-cutoffs.xlsx',
    'kcet-2023-round3(extended)-cutoffs.xlsx',
    'kcet-2024-mock-round1-cutoffs.xlsx',
    'kcet-2024-round1-cutoffs.xlsx',
    'kcet-2024-round2-cutoffs.xlsx',
    'kcet-2024-round3(extended)-cutoffs.xlsx',
    'kcet-2025-mock-round1-cutoffs.xlsx',
    'kcet-2025-round1-cutoffs.xlsx'
  ]
  
  let movedCount = 0
  
  for (const fileName of xlsxFiles) {
    const sourcePath = path.join(rootDir, fileName)
    const destPath = path.join(publicDir, fileName)
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath)
        console.log(`✓ Moved ${fileName}`)
        movedCount++
      } catch (error) {
        console.error(`✗ Failed to move ${fileName}:`, error.message)
      }
    } else {
      console.log(`- Skipped ${fileName} (not found)`)
    }
  }
  
  console.log(`\nCompleted! Moved ${movedCount} XLSX files to public directory.`)
  console.log('These files are now accessible via web URLs like:')
  console.log('- /kcet-2025-round1-cutoffs.xlsx')
  console.log('- /kcet-2024-round1-cutoffs.xlsx')
  console.log('- etc.')
}

moveXLSXFiles()
