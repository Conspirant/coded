/**
 * KEA Option Entry PDF Parser - Anchor & Content-Based Approach
 * 1. Uses College+Course code and Fee patterns as anchors for every row.
 * 2. Learns column boundaries dynamically from anchored rows.
 * 3. Splits text based on these anchors, ensuring 100% data separation.
 * 4. Includes fallback stream parser and scanned-PDF detection.
 */

import { pdfjsLib, configurePDFJS, pdfjsWorker } from './pdf-config';

configurePDFJS();

export interface ParsedOption {
  id: string;
  collegeCode: string;
  branchCode: string;
  collegeName: string;
  branchName: string;
  location: string;
  collegeCourse: string;
  priority: number;
  courseFee?: string;
  collegeAddress?: string;
}

interface TextItem {
  text: string;
  x: number;
  y: number;
}

export class PDFParser {
  // Learned boundaries (will be updated dynamically)
  private static feeStartX = 300;
  private static collegeStartX = 450;

  static async parseWithFallback(file: File): Promise<ParsedOption[]> {
    console.log('🚀 Starting Anchor & Content-Based PDF parsing...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      let pdf: any;

      try {
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      } catch (firstError) {
        console.warn('⚠️ Standard PDF parsing failed, retrying on main-thread via local fake worker:', firstError);
        
        // Ensure workerSrc points to the local absolute URL so that the fake worker
        // dynamically imports the worker locally from our own origin, NOT from CDNJS!
        if (pdfjsLib.GlobalWorkerOptions) {
          const absoluteWorkerUrl = new URL(pdfjsWorker, window.location.origin).toString();
          pdfjsLib.GlobalWorkerOptions.workerSrc = absoluteWorkerUrl;
        }
        
        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      }

      console.log(`📄 PDF loaded: ${pdf.numPages} pages`);

      const allOptions: ParsedOption[] = [];
      let pendingOption: any = null;
      let totalItemsCount = 0;
      const pagesTextItems: TextItem[][] = [];

      // Reset boundaries to reasonable defaults
      this.feeStartX = 300;
      this.collegeStartX = 450;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // 1. Extract Items & Sort
        const items: TextItem[] = textContent.items
          .filter((item: any) => item.str && item.str.trim())
          .map((item: any) => ({
            text: item.str.trim(),
            x: item.transform[4],
            y: item.transform[5]
          }));

        totalItemsCount += items.length;
        pagesTextItems.push(items);

        // Sort by Y desc (top to bottom), then X asc (left to right)
        items.sort((a, b) => b.y - a.y || a.x - b.x);

        // 2. Group into Visual Rows with a fixed baseline to avoid line-drift staircasing
        const rows: TextItem[][] = [];
        let currentRow: TextItem[] = [];
        let rowBaselineY = -1;

        for (const item of items) {
          if (rowBaselineY === -1 || Math.abs(item.y - rowBaselineY) <= 8) {
            currentRow.push(item);
            if (rowBaselineY === -1) rowBaselineY = item.y;
          } else {
            rows.push(currentRow);
            currentRow = [item];
            rowBaselineY = item.y;
          }
        }
        if (currentRow.length > 0) rows.push(currentRow);

        // 3. Process Rows
        for (const row of rows) {
          // First, check if this is a Header row (contains "Course Name" etc) and skip it
          if (row.some(i => /Course\s*Name/i.test(i.text) || /College\s*Name/i.test(i.text))) {
            continue;
          }

          // Extract data using Anchors
          const { optNo, code, courseName, fee, collegeName } = this.parseRowWithAnchors(row);

          if (code) {
            // New Option
            if (pendingOption) this.finalizeOption(pendingOption, allOptions);
            pendingOption = {
              optNo: optNo || (allOptions.length + 1).toString(),
              code,
              courseNameParts: courseName ? [courseName] : [],
              feeParts: fee ? [fee] : [],
              collegeNameParts: collegeName ? [collegeName] : []
            };
          } else if (pendingOption) {
            // Continuation Row
            if (courseName) pendingOption.courseNameParts.push(courseName);
            if (fee) pendingOption.feeParts.push(fee);
            if (collegeName) pendingOption.collegeNameParts.push(collegeName);
          }
        }
      }

      if (pendingOption) this.finalizeOption(pendingOption, allOptions);

      // Check if PDF was an image / scanned copy with no selectable text
      if (totalItemsCount === 0) {
        throw new Error("This PDF appears to be a scanned image or photo without selectable digital text. Please download the official digital PDF from the KEA portal.");
      }

      // Stream fallback if row-based grouping yielded 0 options but digital text exists
      if (allOptions.length === 0 && totalItemsCount > 0) {
        console.log('🔄 Row-based parsing returned 0 options. Attempting stream fallback...');
        const streamOptions = this.parseStreamFallback(pagesTextItems);
        if (streamOptions.length > 0) {
          console.log(`✅ Stream fallback parsed ${streamOptions.length} valid options`);
          return streamOptions;
        }
      }

      console.log(`✅ Parsed ${allOptions.length} valid options`);
      return allOptions;

    } catch (error) {
      console.error('❌ PDF parsing failed:', error);
      throw error;
    }
  }

  private static findOptionCode(row: TextItem[]): { code: string; codeItemIndex: number; isCombined: boolean } {
    // 1. Try single item containing combined or spaced code (e.g., E005CS, E005 CS, E005-CS, E001AIML, A001AR, P001PH)
    for (let i = 0; i < row.length; i++) {
      const clean = row[i].text.trim().replace(/^[\(\[\{]/, '').replace(/[\)\]\}]$/, '');
      const match = clean.match(/^([A-Z]\d{2,4})\s*[-/]?\s*([A-Z]{2,5})$/i);
      if (match) {
        return {
          code: (match[1] + match[2]).toUpperCase(),
          codeItemIndex: i,
          isCombined: true
        };
      }
    }

    // 2. Try split format (e.g., E002 in one cell, CS in another in the same row)
    const collegeIndex = row.findIndex(i => {
      const clean = i.text.trim().replace(/^[\(\[\{]/, '').replace(/[\)\]\}]$/, '');
      return /^[A-Z]\d{2,4}$/i.test(clean);
    });

    if (collegeIndex !== -1) {
      const collegeItem = row[collegeIndex];
      const collegeCode = collegeItem.text.trim().replace(/^[\(\[\{]/, '').replace(/[\)\]\}]$/, '').toUpperCase();

      // Find a course code: 2 to 5 letters, no numbers, not common stop words
      const courseIndex = row.findIndex((item, idx) => {
        if (idx === collegeIndex) return false;
        const text = item.text.trim().replace(/^[\(\[\{]/, '').replace(/[\)\]\}]$/, '');
        if (!/^[A-Z]{2,5}$/i.test(text)) return false;
        if (/^(AND|THE|FOR|NEW|OLD|DAY|EVE|POST|ROAD|NEAR|MAIN|CITY|TOWN|GOVT|AIDED)$/i.test(text)) return false;
        return Math.abs(item.x - collegeItem.x) < 250;
      });

      if (courseIndex !== -1) {
        const courseCode = row[courseIndex].text.trim().replace(/^[\(\[\{]/, '').replace(/[\)\]\}]$/, '').toUpperCase();
        return {
          code: collegeCode + courseCode,
          codeItemIndex: collegeIndex,
          isCombined: false
        };
      }
    }

    return { code: '', codeItemIndex: -1, isCombined: false };
  }

  private static parseRowWithAnchors(row: TextItem[]) {
    let optNo = '';
    let code = '';
    let courseName = '';
    let fee = '';
    let collegeName = '';

    // 1. Find Code Anchor
    const parsed = this.findOptionCode(row);
    code = parsed.code;
    const codeItemIndex = parsed.codeItemIndex;

    // Find course code index if it was separate
    let courseItemIndex = -1;
    if (code && !parsed.isCombined) {
      const collegeIndex = codeItemIndex;
      const courseCode = code.substring(4);
      courseItemIndex = row.findIndex((item, idx) => {
        return idx !== collegeIndex && item.text.trim().toUpperCase() === courseCode;
      });
    }

    // 2. Find Fee Anchor (digits with comma, e.g. 1,07,000 or 98,000)
    const feeItemIndex = row.findIndex(i => /\d{1,3}(?:,\d{2,3})+/.test(i.text));
    let feeX = -1;

    if (feeItemIndex !== -1) {
      feeX = row[feeItemIndex].x;
      this.feeStartX = feeX - 10;
      this.collegeStartX = feeX + 80;
    }

    // 3. Assign Text Buckets based on Anchors
    for (let i = 0; i < row.length; i++) {
      if (i === codeItemIndex) continue; // Skip consumed code
      if (courseItemIndex !== -1 && i === courseItemIndex) continue; // Skip separate course code

      const item = row[i];
      const x = item.x;
      const txt = item.text;

      // Bucket Logic
      if (i === feeItemIndex) {
        fee += (fee ? ' ' : '') + txt;
      } else if (code && i < codeItemIndex) {
        // Left of Code -> OptNo
        if (/^\d+$/.test(txt)) optNo = txt;
      } else {
        if (feeItemIndex !== -1) {
          if (i < feeItemIndex && (!code || i > codeItemIndex)) {
            courseName += (courseName ? ' ' : '') + txt;
          } else if (i > feeItemIndex) {
            collegeName += (collegeName ? ' ' : '') + txt;
          }
        } else {
          if (x < this.feeStartX) {
            courseName += (courseName ? ' ' : '') + txt;
          } else if (x > this.collegeStartX) {
            collegeName += (collegeName ? ' ' : '') + txt;
          } else {
            if (/College|Institute|University|Engineering|Adyar|Road|Post|Dist|Campus|Bengaluru|Bangalore|Mysuru|Mangaluru/i.test(txt)) {
              collegeName += (collegeName ? ' ' : '') + txt;
            } else {
              courseName += (courseName ? ' ' : '') + txt;
            }
          }
        }
      }
    }

    const isAnchored = !!code;
    return { optNo, code, courseName, fee, collegeName, isAnchored };
  }

  /**
   * Fallback stream parser in case visual row alignment fails on non-standard PDFs
   */
  private static parseStreamFallback(pages: TextItem[][]): ParsedOption[] {
    const list: ParsedOption[] = [];
    const codePattern = /\b([A-Z]\d{2,4})\s*[-/]?\s*([A-Z]{2,5})\b/g;

    let globalPriority = 1;

    for (const pageItems of pages) {
      // Sort in reading order
      const sorted = [...pageItems].sort((a, b) => b.y - a.y || a.x - b.x);
      const fullPageText = sorted.map(i => i.text).join(' ');

      let match: RegExpExecArray | null;
      while ((match = codePattern.exec(fullPageText)) !== null) {
        const collegeCode = match[1].toUpperCase();
        const branchCode = match[2].toUpperCase();
        const code = collegeCode + branchCode;

        // Skip false positives
        if (/^(AND|THE|FOR|NEW|OLD|DAY|EVE|POST|ROAD|NEAR)$/i.test(branchCode)) continue;

        const branchName = this.getBranchName(branchCode);
        const collegeName = `College ${collegeCode}`;

        list.push({
          id: `opt-stream-${globalPriority}-${code}`,
          priority: globalPriority,
          collegeCourse: code,
          collegeCode,
          branchCode,
          branchName,
          collegeName,
          location: 'Karnataka',
          courseFee: 'Not specified',
          collegeAddress: collegeName
        });

        globalPriority++;
      }
    }

    return list;
  }

  private static finalizeOption(data: any, list: ParsedOption[]) {
    const fullCourseName = data.courseNameParts.join(' ');
    const fullCollegeName = data.collegeNameParts.join(' ');
    const fullFee = data.feeParts.join(' ');

    const collegeCode = data.code.substring(0, 4);
    const branchCode = data.code.substring(4);

    // Cleanup text
    const cleanFee = fullFee.match(/(\d{1,3}(?:,\d{2,3})+)/)?.[0] || 'Not specified';

    let cleanCourse = fullCourseName
      .replace(/One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Lakh|Thousand|Hundred|Rs\.|Rupees|and\s+Ten|and\s+Four/gi, '')
      .replace(/Downloaded\s+Date:.*$/gi, '')
      .replace(/KARNATAKA\s+EXAMINATIONS\s+AUTHORITY.*$/gi, '')
      .replace(/ADMISSION\s+TO\s+UGCET.*$/gi, '')
      .replace(/Page\s+\d+\s*\/\s*\d+.*$/gi, '')
      .replace(/\s+/g, ' ').trim();

    // Fallback
    if (!cleanCourse || cleanCourse.length < 3 || this.looksLikeDocumentChrome(cleanCourse)) {
      cleanCourse = this.getBranchName(branchCode);
    }

    // College cleanup
    let cleanCollege = fullCollegeName
      .replace(/One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Lakh|Thousand|Hundred|Rs\.|Rupees|and\s+Ten|and\s+Four/gi, '')
      .replace(/Downloaded\s+Date:.*$/gi, '')
      .replace(/KARNATAKA\s+EXAMINATIONS\s+AUTHORITY.*$/gi, '')
      .replace(/ADMISSION\s+TO\s+UGCET.*$/gi, '')
      .replace(/Page\s+\d+\s*\/\s*\d+.*$/gi, '')
      .replace(/\s+/g, ' ').trim();

    if (!cleanCollege) cleanCollege = `College ${collegeCode}`;

    list.push({
      id: `opt-${data.optNo}-${data.code}`,
      priority: parseInt(data.optNo) || (list.length + 1),
      collegeCourse: data.code,
      collegeCode,
      branchCode,
      branchName: cleanCourse,
      collegeName: cleanCollege,
      location: this.extractLocation(cleanCollege),
      courseFee: cleanFee,
      collegeAddress: cleanCollege
    });
  }

  private static getBranchName(code: string): string {
    const names: Record<string, string> = {
      'AD': 'Artificial Intelligence and Data Science',
      'BG': 'Artificial Intelligence and Data Science',
      'AI': 'Artificial Intelligence and Machine Learning',
      'AM': 'Computer Science (AI & Machine Learning)',
      'CS': 'Computer Science and Engineering',
      'CSE': 'Computer Science and Engineering',
      'CA': 'Computer Science (AI & Machine Learning)',
      'CF': 'Computer Science (Artificial Intelligence)',
      'CY': 'Computer Science (Cyber Security)',
      'BX': 'Computer Science (Cyber Security)',
      'DC': 'Computer Science (Data Science)',
      'DS': 'Computer Science (Data Science)',
      'BF': 'Computer Science (Data Science)',
      'BW': 'Computer Science and Engineering',
      'BZ': 'Computer Science (Data Science)',
      'DL': 'Computer Science and Engineering',
      'LG': 'Computer Science and Engineering',
      'LD': 'Computer Science (Data Science)',
      'EC': 'Electronics and Communication Engineering',
      'ECE': 'Electronics and Communication Engineering',
      'BB': 'Electronics and Communication Engineering',
      'EE': 'Electrical and Electronics Engineering',
      'EEE': 'Electrical and Electronics Engineering',
      'BJ': 'Electrical and Electronics Engineering',
      'IE': 'Information Science and Engineering',
      'IS': 'Information Science and Engineering',
      'ISE': 'Information Science and Engineering',
      'CU': 'Information Science and Engineering',
      'LH': 'Information Science and Engineering',
      'ME': 'Mechanical Engineering',
      'MECH': 'Mechanical Engineering',
      'DB': 'Mechanical Engineering',
      'CE': 'Civil Engineering',
      'CIVIL': 'Civil Engineering',
      'BP': 'Civil Engineering',
      'BT': 'Biotechnology',
      'BM': 'Biomedical Engineering',
      'AR': 'Architecture',
      'AT': 'Architecture',
      'CH': 'Chemical Engineering',
      'AE': 'Aeronautical Engineering',
      'AS': 'Aerospace Engineering',
      'RA': 'Robotics and Automation',
      'RO': 'Robotics and Artificial Intelligence',
      'CB': 'Computer Science and Business Systems',
      'CSBS': 'Computer Science and Business Systems',
      'ET': 'Electronics and Telecommunication Engineering',
      'EI': 'Electronics and Instrumentation Engineering',
      'MD': 'Medical Electronics Engineering',
      'AU': 'Automobile Engineering'
    };
    return names[code] || `${code} Engineering`;
  }

  private static looksLikeDocumentChrome(text: string): boolean {
    return /Downloaded\s+Date|KARNATAKA\s+EXAMINATIONS|ADMISSION\s+TO\s+UGCET|OPTIONS\s+LIST|Page\s+\d+\s*\/\s*\d+/i.test(text);
  }

  private static extractLocation(text: string): string {
    const locs = ['Bangalore', 'Bengaluru', 'Mysore', 'Mysuru', 'Mangalore', 'Mangaluru', 'Hubli', 'Hubballi', 'Belgaum', 'Belagavi', 'Tumkur', 'Tumakuru', 'Varthur', 'Davangere', 'Udupi', 'Manipal', 'Shimoga', 'Shivamogga'];
    const u = (text || '').toUpperCase();
    for (const loc of locs) {
      if (u.includes(loc.toUpperCase())) return loc;
    }
    return 'Karnataka';
  }
}
