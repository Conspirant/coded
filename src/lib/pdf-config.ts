import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

/**
 * PDF.js Configuration
 * 
 * This file exports the configured pdfjsLib for use in other files.
 */

// Configure PDF.js worker
export function configurePDFJS() {
  try {
    console.log('📄 Configuring PDF.js...');
    console.log('📄 PDF.js version:', pdfjsLib.version);

    if (pdfjsLib.GlobalWorkerOptions) {
      // First try to use the locally bundled worker via Vite ?url loader
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      console.log('📄 PDF.js worker configured locally:', pdfjsWorker);
    }
  } catch (error) {
    console.warn('⚠️ Could not configure PDF.js locally, falling back to CDN:', error);
    try {
      if (pdfjsLib.GlobalWorkerOptions) {
        // Fallback 1: jsDelivr (extremely reliable in India/Asia)
        const workerUrl = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        console.log('📄 PDF.js worker configured with jsDelivr CDN:', workerUrl);
      }
    } catch (cdnError) {
      console.warn('⚠️ Could not configure jsDelivr CDN, falling back to unpkg:', cdnError);
      try {
        if (pdfjsLib.GlobalWorkerOptions) {
          // Fallback 2: unpkg CDN
          const workerUrl = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
          console.log('📄 PDF.js worker configured with unpkg CDN:', workerUrl);
        }
      } catch (unpkgError) {
        console.error('❌ Could not configure any PDF.js worker fallback:', unpkgError);
      }
    }
  }
}

// Export configured pdfjsLib for use in other files
export { pdfjsLib };

