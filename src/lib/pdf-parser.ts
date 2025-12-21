/**
 * KEA Option Entry PDF Parser - Anchor & Content-Based Approach
 * 1. Uses "E..." code and Fee "1,23..." patterns as anchors for every row.
 * 2. Learns column boundaries dynamically from anchored rows.
 * 3. Splits text based on these anchors, ensuring 100% data separation.
 */

import { pdfjsLib, configurePDFJS } from './pdf-config';

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
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const allOptions: ParsedOption[] = [];
      let pendingOption: any = null;

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

        // Sort by Y desc, then X asc
        items.sort((a, b) => b.y - a.y || a.x - b.x);

        // 2. Group into Visual Rows
        const rows: TextItem[][] = [];
        let currentRow: TextItem[] = [];
        let currentY = -1;

        for (const item of items) {
          if (currentY === -1 || Math.abs(item.y - currentY) < 10) {
            currentRow.push(item);
            currentY = item.y;
          } else {
            rows.push(currentRow);
            currentRow = [item];
            currentY = item.y;
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
          const { optNo, code, courseName, fee, collegeName, isAnchored } = this.parseRowWithAnchors(row);

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

      return allOptions;

    } catch (error) {
      console.error('❌ PDF parsing failed:', error);
      throw error;
    }
  }

  private static parseRowWithAnchors(row: TextItem[]) {
    let optNo = '';
    let code = '';
    let courseName = '';
    let fee = '';
    let collegeName = '';
    let isAnchored = false;

    // 1. Find Code Anchor (E###)
    const codeItemIndex = row.findIndex(i => /E\d{3}[A-Z]{2,3}/i.test(i.text));
    if (codeItemIndex !== -1) {
      code = row[codeItemIndex].text.match(/E\d{3}[A-Z]{2,3}/i)![0].toUpperCase();
    }

    // 2. Find Fee Anchor (digits with comma)
    const feeItemIndex = row.findIndex(i => /\d{1,3}(?:,\d{2,3})+/.test(i.text));
    let feeX = -1;

    if (feeItemIndex !== -1) {
      feeX = row[feeItemIndex].x;
      // Update dynamic boundary
      this.feeStartX = feeX - 10; // Fee starts slightly left of its numbers
      // Also set college start slightly right of fee end (approx width of fee is 60)
      this.collegeStartX = feeX + 80;
      isAnchored = true;
    }

    // 3. Assign Text Buckets based on Anchors
    for (let i = 0; i < row.length; i++) {
      if (i === codeItemIndex) continue; // Skip consumed code

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
        // Right of Code (or continuation row)
        // Use Fee Anchor X to split Branch Name vs College Name

        // Determine if this text belongs to Fee, Course, or College

        // If we found a fee in this row, use its index to split
        if (feeItemIndex !== -1) {
          if (i < feeItemIndex && (!code || i > codeItemIndex)) {
            courseName += (courseName ? ' ' : '') + txt;
          } else if (i > feeItemIndex) {
            collegeName += (collegeName ? ' ' : '') + txt;
          }
        }
        else {
          // No fee in this row (continuation). Use learned boundaries.
          // If text X is left of learned fee start -> Course Name
          // IF text X is right of learned college start -> College Name
          // Middle overlaps? Assign based on proximity.

          if (x < this.feeStartX) {
            courseName += (courseName ? ' ' : '') + txt;
          } else if (x > this.collegeStartX) {
            collegeName += (collegeName ? ' ' : '') + txt;
          } else {
            // Ambiguous zone (Fee column empty row)
            // Usually fee column is empty in continuation rows
            // Check text content?
            if (/College|Institute|University|Engineering|Adyar|Road|Post|Dist/i.test(txt)) {
              collegeName += (collegeName ? ' ' : '') + txt;
            } else {
              courseName += (courseName ? ' ' : '') + txt;
            }
          }
        }
      }
    }

    return { optNo, code, courseName, fee, collegeName, isAnchored };
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
      .replace(/\s+/g, ' ').trim();

    // Fallback
    if (!cleanCourse || cleanCourse.length < 3) cleanCourse = this.getBranchName(branchCode);

    // College cleanup
    let cleanCollege = fullCollegeName
      .replace(/One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Lakh|Thousand|Hundred|Rs\.|Rupees|and\s+Ten|and\s+Four/gi, '')
      .replace(/\s+/g, ' ').trim();

    if (!cleanCollege) cleanCollege = `College ${collegeCode}`;

    list.push({
      id: `opt-${data.optNo}-${data.code}`,
      priority: parseInt(data.optNo),
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
      'AI': 'Artificial Intelligence and Machine Learning',
      'CS': 'Computer Science and Engineering',
      'CA': 'Computer Science (AI)',
      'CY': 'Computer Science (Cyber Security)',
      'DS': 'Computer Science (Data Science)',
      'EC': 'Electronics and Communication Engineering',
      'ME': 'Mechanical Engineering',
      'CE': 'Civil Engineering',
      'BT': 'Biotechnology'
    };
    return names[code] || `${code} Engineering`;
  }

  private static extractLocation(text: string): string {
    const locs = ['Bangalore', 'Bengaluru', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Tumkur', 'Varthur', 'Davangere'];
    const u = (text || '').toUpperCase();
    for (const loc of locs) {
      if (u.includes(loc.toUpperCase())) return loc;
    }
    return 'Karnataka';
  }
}
