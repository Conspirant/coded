import * as pdfjsLib from 'pdfjs-dist';

/**
 * PDF.js Configuration
 * 
 * This file exports the configured pdfjsLib for use in other files.
 */

// Configure PDF.js worker
export function configurePDFJS() {
  try {
    if (pdfjsLib.GlobalWorkerOptions) {
      // Use unpkg CDN which has all versions (cdnjs doesn't have 5.x)
      const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      }
  } catch (error) {
    console.warn('⚠️ Could not configure PDF.js:', error);
  }
}

// Export configured pdfjsLib for use in other files
export { pdfjsLib };

