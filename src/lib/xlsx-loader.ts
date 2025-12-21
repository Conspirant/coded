import * as XLSX from 'xlsx'

export interface XLSXData {
  cutoffs: any[]
  metadata: {
    last_updated: string
    total_files_processed: number
    total_entries: number
    data_sources: string[]
  }
}

export class XLSXLoader {
  /**
   * Read XLSX file from server directory
   */
  static async loadFromServer(filePath: string): Promise<XLSXData> {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to fetch XLSX file: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    
    return this.parseWorkbook(workbook, filePath)
  }

  /**
   * Load all XLSX files from the server and combine them
   */
  static async loadAllXLSXFiles(): Promise<XLSXData> {
    const xlsxFiles = [
      '/kcet-2023-round1-cutoffs.xlsx',
      '/kcet-2023-round2-cutoffs.xlsx',
      '/kcet-2023-round3(extended)-cutoffs.xlsx',
      '/kcet-2024-mock-round1-cutoffs.xlsx',
      '/kcet-2024-round1-cutoffs.xlsx',
      '/kcet-2024-round2-cutoffs.xlsx',
      '/kcet-2024-round3(extended)-cutoffs.xlsx',
      '/kcet-2025-mock-round1-cutoffs.xlsx',
      '/kcet-2025-round1-cutoffs.xlsx'
    ]

    const allCutoffs: any[] = []
    const processedFiles: string[] = []
    let totalEntries = 0

    for (const filePath of xlsxFiles) {
      try {
        const data = await this.loadFromServer(filePath)
        allCutoffs.push(...data.cutoffs)
        processedFiles.push(filePath)
        totalEntries += data.cutoffs.length
        } catch (error) {
        console.warn(`Failed to load ${filePath}:`, error)
        // Continue with other files even if one fails
      }
    }

    return {
      cutoffs: allCutoffs,
      metadata: {
        last_updated: new Date().toISOString(),
        total_files_processed: processedFiles.length,
        total_entries: totalEntries,
        data_sources: processedFiles
      }
    }
  }

  /**
   * Parse workbook and extract cutoff data
   */
  private static parseWorkbook(workbook: XLSX.WorkBook, source: string): XLSXData {
    const cutoffs: any[] = []

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      try {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
        
        if (jsonData.length === 0) {
          continue
        }

        // Extract data from this sheet
        const sheetData = this.extractCutoffData(jsonData, source, sheetName)
        cutoffs.push(...sheetData)
        
      } catch (error) {
        console.warn(`Failed to process sheet ${sheetName}:`, error)
      }
    }

    return {
      cutoffs,
      metadata: {
        last_updated: new Date().toISOString(),
        total_files_processed: 1,
        total_entries: cutoffs.length,
        data_sources: [source]
      }
    }
  }

  /**
   * Extract cutoff data from sheet data
   */
  private static extractCutoffData(jsonData: any[][], source: string, sheetName: string): any[] {
    const results: any[] = []
    
    // Detect year from filename
    const yearMatch = source.match(/20\d{2}/)
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString()
    
    // Detect round from filename
    const round = this.determineRound(source)

    // Extract college info from the sheet
    const collegeInfo = this.extractCollegeInfoFromSheet(jsonData, source)
    if (!collegeInfo) {
      console.warn(`No college info found in sheet ${sheetName}`)
      return results
    }

    // Find header row
    const headerRowIndex = this.findHeaderRow(jsonData)
    if (headerRowIndex === -1) {
      console.warn(`No header row found in sheet ${sheetName}`)
      return results
    }

    const headerRow = jsonData[headerRowIndex]
    
    // Map category columns
    const categoryColumns: { [key: number]: string } = {}
    for (let i = 1; i < headerRow.length; i++) {
      const category = String(headerRow[i] || '').trim()
      if (this.isValidCategory(category)) {
        categoryColumns[i] = category
      }
    }

    // Process data rows
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (!row || row.length === 0) continue

      // Extract course info (first column is course name)
      const courseName = String(row[0] || '').trim()
      if (!courseName || courseName === 'nan' || courseName.toLowerCase().includes('course')) {
        continue
      }

      const courseInfo = this.extractCourseInfo(courseName)
      if (!courseInfo) continue

      // Extract cutoff ranks for each category
      for (const [colIndex, category] of Object.entries(categoryColumns)) {
        const cutoffRank = this.extractCutoffRank(row[parseInt(colIndex)])
        if (cutoffRank > 0 && cutoffRank < 200000) { // Reasonable range
          results.push({
            institute: collegeInfo.name,
            institute_code: collegeInfo.code,
            course: courseInfo.name,
            course_code: courseInfo.code,
            category: category,
            cutoff_rank: cutoffRank,
            year: year,
            round: round,
            source: source,
            sheet: sheetName
          })
        }
      }
    }

    return results
  }

  /**
   * Extract college information from cell data
   */
  private static extractCollegeInfo(cell: any): { name: string; code: string } | null {
    if (!cell) return null
    
    const cellStr = String(cell).trim()
    
    // Look for college code pattern (E001, E002, etc.)
    const codeMatch = cellStr.match(/^E\d{3}/)
    if (codeMatch) {
      return {
        code: codeMatch[0],
        name: cellStr.replace(codeMatch[0], '').trim().replace(/^[-\s,]+/, '')
      }
    }
    
    // If no code found, use the entire cell as name
    return {
      code: 'UNKNOWN',
      name: cellStr
    }
  }

  /**
   * Extract course information from cell data
   */
  private static extractCourseInfo(cell: any): { name: string; code: string } | null {
    if (!cell) return null
    
    const cellStr = String(cell).trim()
    const courseUpper = cellStr.toUpperCase()
    
    // Comprehensive course mappings based on Python script
    const courseMappings: { [key: string]: { name: string; code: string } } = {
      'CS': { name: 'Computer Science Engineering', code: 'CS' },
      'CSE': { name: 'Computer Science Engineering', code: 'CS' },
      'COMPUTER SCIENCE': { name: 'Computer Science Engineering', code: 'CS' },
      'COMPUTER': { name: 'Computer Science Engineering', code: 'CS' },
      'CE': { name: 'Civil Engineering', code: 'CE' },
      'CIVIL': { name: 'Civil Engineering', code: 'CE' },
      'EC': { name: 'Electronics & Communication Engineering', code: 'EC' },
      'ECE': { name: 'Electronics & Communication Engineering', code: 'EC' },
      'ELECTRONICS': { name: 'Electronics & Communication Engineering', code: 'EC' },
      'ME': { name: 'Mechanical Engineering', code: 'ME' },
      'MECH': { name: 'Mechanical Engineering', code: 'ME' },
      'MECHANICAL': { name: 'Mechanical Engineering', code: 'ME' },
      'EE': { name: 'Electrical Engineering', code: 'EE' },
      'EEE': { name: 'Electrical & Electronics Engineering', code: 'EE' },
      'ELECTRICAL': { name: 'Electrical Engineering', code: 'EE' },
      'IT': { name: 'Information Technology', code: 'IT' },
      'INFORMATION TECHNOLOGY': { name: 'Information Technology', code: 'IT' },
      'INFORMATION SCIENCE': { name: 'Information Science', code: 'IE' },
      'AI': { name: 'Artificial Intelligence', code: 'AI' },
      'ARTIFICIAL INTELLIGENCE': { name: 'Artificial Intelligence', code: 'AI' },
      'AI&DS': { name: 'Artificial Intelligence & Data Science', code: 'AI' },
      'BIO': { name: 'Biotechnology', code: 'BT' },
      'BIOTECH': { name: 'Biotechnology', code: 'BT' },
      'CHEMICAL': { name: 'Chemical Engineering', code: 'CH' },
      'TELECOM': { name: 'Telecommunication', code: 'TC' },
      'INSTRUMENTATION': { name: 'Instrumentation Technology', code: 'IT' },
      'MEDICAL': { name: 'Medical Electronics', code: 'MD' },
      'ROBOTICS': { name: 'Robotics & Automation', code: 'RA' },
      'AUTOMATION': { name: 'Robotics & Automation', code: 'RA' },
      'AEROSPACE': { name: 'Aerospace Engineering', code: 'SE' },
      'BUSINESS SYSTEMS': { name: 'Computer Science & Business Systems', code: 'CB' },
      'CYBER': { name: 'Cyber Security', code: 'CY' },
      'DATA SCIENCE': { name: 'Data Science', code: 'DS' },
      'DATA': { name: 'Data Science', code: 'DS' }
    }
    
    // Try exact match first
    if (courseMappings[courseUpper]) {
      return courseMappings[courseUpper]
    }
    
    // Try partial matching
    for (const [key, value] of Object.entries(courseMappings)) {
      if (courseUpper.includes(key) || key.includes(courseUpper)) {
        return value
      }
    }
    
    // Handle common variations
    const variations: { [key: string]: string } = {
      'CSE': 'CS',
      'COMPUTER SCIENCE': 'CS',
      'COMPUTER': 'CS',
      'ECE': 'EC',
      'ELECTRONICS': 'EC',
      'MECH': 'ME',
      'MECHANICAL': 'ME',
      'CIVIL': 'CE',
      'IT': 'IE',
      'INFORMATION TECHNOLOGY': 'IE',
      'INFORMATION SCIENCE': 'IE',
      'ELECTRICAL': 'EE',
      'BIO': 'BT',
      'BIOTECH': 'BT',
      'CHEMICAL': 'CH',
      'TELECOM': 'TC',
      'INSTRUMENTATION': 'IT',
      'MEDICAL': 'MD',
      'AI': 'AI',
      'ARTIFICIAL INTELLIGENCE': 'AI',
      'MACHINE LEARNING': 'AI',
      'ROBOTICS': 'RA',
      'AUTOMATION': 'RA',
      'AEROSPACE': 'SE',
      'BUSINESS SYSTEMS': 'CB',
      'CYBER': 'CY',
      'DATA SCIENCE': 'DS',
      'DATA': 'DS'
    }
    
    for (const [variation, code] of Object.entries(variations)) {
      if (courseUpper.includes(variation)) {
        const name = courseMappings[code]?.name || variation
        return { name, code }
      }
    }
    
    console.warn(`Unknown course: ${cellStr}`)
    return null
  }

  /**
   * Extract cutoff rank from cell data
   */
  private static extractCutoffRank(cell: any): number {
    if (!cell) return 0
    
    const cellStr = String(cell).trim()
    
    // Remove common non-numeric characters
    const cleanStr = cellStr.replace(/[^\d]/g, '')
    
    const rank = parseInt(cleanStr)
    return isNaN(rank) ? 0 : rank
  }

  /**
   * Determine round from filename
   */
  private static determineRound(filename: string): string {
    const filenameLower = filename.toLowerCase()
    if (filenameLower.includes('round1')) return 'R1'
    if (filenameLower.includes('round2')) return 'R2'
    if (filenameLower.includes('round3') || filenameLower.includes('extended')) return 'EXT'
    if (filenameLower.includes('mock')) return 'MOCK'
    return 'R1'
  }

  /**
   * Extract college info from sheet data
   */
  private static extractCollegeInfoFromSheet(jsonData: any[][], source: string): { name: string; code: string } | null {
    // First, try to find college info in the first few rows
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i]
      if (!row) continue
      
      ) // Show first 3 cells for debugging
      
      for (let j = 0; j < row.length; j++) {
        const cellValue = String(row[j] || '').trim()
        if (!cellValue || cellValue === 'nan') continue
        
        // Look for college code pattern (E001, E002, etc.)
        const collegeMatch = cellValue.match(/College:\s*(E\d{3})\s*(.+?)(?:\s*\(|$)/i)
        if (collegeMatch) {
          const code = collegeMatch[1]
          const name = collegeMatch[2].trim()
          return { code, name }
        }
        
        // Also try direct E001 pattern
        const directMatch = cellValue.match(/^(E\d{3})\s*(.+)$/)
        if (directMatch) {
          const code = directMatch[1]
          const name = directMatch[2].trim()
          : ${code} - ${name}`)
          return { code, name }
        }
        
        // Try just E001 pattern anywhere in the cell
        const codeMatch = cellValue.match(/(E\d{3})/)
        if (codeMatch) {
          const code = codeMatch[1]
          const name = cellValue.replace(code, '').trim()
          : ${code} - ${name}`)
          return { code, name }
        }
      }
    }
    
    console.warn(`Could not extract college info from ${source}`)
    return null
  }

  /**
   * Find header row containing category information
   */
  private static findHeaderRow(jsonData: any[][]): number {
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (!row || row.length === 0) continue
      
      const firstCell = String(row[0] || '').trim().toLowerCase()
      if (firstCell.includes('course name') || firstCell.includes('course') || 
          firstCell.includes('branch') || firstCell.includes('branch name')) {
        return i
      }
    }
    return -1
  }

  /**
   * Check if category is valid
   */
  private static isValidCategory(category: string): boolean {
    const validCategories = ['GM', 'SC', 'ST', 'OBC', 'CATEGORY', '1G', '2A', '2B', '3A', '3B']
    return validCategories.some(valid => category.toUpperCase().includes(valid))
  }
}
