/**
 * PDF URL Mapper Utility
 * Maps cutoff data (year, round) to the corresponding PDF file URL
 * Also provides page number mapping for direct navigation
 */

// Cache for the page index
let pageIndex: Record<string, Record<string, number>> | null = null;
let pageIndexLoading: Promise<void> | null = null;

/**
 * Load the PDF page index from the server
 */
async function loadPageIndex(): Promise<void> {
    if (pageIndex !== null) return;
    if (pageIndexLoading !== null) return pageIndexLoading;

    pageIndexLoading = (async () => {
        try {
            const response = await fetch('/data/pdf-page-index.json');
            if (response.ok) {
                const data = await response.json();
                pageIndex = data.index || {};
                .length, 'PDFs');
            } else {
                console.warn('⚠️ Could not load PDF page index');
                pageIndex = {};
            }
        } catch (error) {
            console.warn('⚠️ Error loading PDF page index:', error);
            pageIndex = {};
        }
    })();

    return pageIndexLoading;
}

/**
 * Get the PDF URL for a given year and round
 * @param year - The year of the cutoff data (e.g., "2023", "2024", "2025")
 * @param round - The round code (e.g., "R1", "R2", "R3", "EXT", "MOCK")
 * @returns The PDF URL path or null if no mapping exists
 */
export function getPdfUrl(year: string, round: string): string | null {
    // Map round codes to PDF filename patterns
    const roundMap: Record<string, string> = {
        'R1': 'round1',
        'R2': 'round2',
        'R3': 'round3',
        'EXT': 'round3(extended)',
        'MOCK': 'mock-round1',
        // Also handle full round names that might be in the data
        'Round 1': 'round1',
        'Round 2': 'round2',
        'Round 3': 'round3',
        'Round 3 (Extended)': 'round3(extended)',
        'Mock Round 1': 'mock-round1',
    };

    const roundSlug = roundMap[round];
    if (!roundSlug) {
        console.warn(`Unknown round format: ${round}`);
        return null;
    }

    return `/kcet-${year}-${roundSlug}-cutoffs.pdf`;
}

/**
 * Get the page number for a specific institute in a PDF
 * @param year - The year of the cutoff data
 * @param round - The round code
 * @param instituteCode - The institute code (e.g., "E086")
 * @returns The page number or 1 if not found
 */
export async function getPageNumber(year: string, round: string, instituteCode: string): Promise<number> {
    // Ensure page index is loaded
    await loadPageIndex();

    if (!pageIndex) return 1;

    const pdfKey = `${year}-${round}`;
    const pdfPages = pageIndex[pdfKey];

    if (!pdfPages) return 1;

    return pdfPages[instituteCode] || 1;
}

/**
 * Get the full PDF URL with page number and search term for highlighting
 * @param year - The year of the cutoff data
 * @param round - The round code
 * @param instituteCode - The institute code
 * @returns The full PDF URL with page and search fragments, or null if no PDF exists
 */
export async function getPdfUrlWithPage(
    year: string,
    round: string,
    instituteCode: string
): Promise<string | null> {
    const baseUrl = getPdfUrl(year, round);
    if (!baseUrl) return null;

    const pageNum = await getPageNumber(year, round, instituteCode);

    // Add page and search fragments for PDF navigation and highlighting
    // Chrome/Edge/Firefox browsers support #page=N&search=text 
    // This will navigate to the page AND highlight/search for the institute code
    return `${baseUrl}#page=${pageNum}&search=${encodeURIComponent(instituteCode)}`;
}

/**
 * Get display name for a round code
 * @param round - The round code
 * @returns Human-readable round name
 */
export function getRoundDisplayName(round: string): string {
    const displayMap: Record<string, string> = {
        'R1': 'Round 1',
        'R2': 'Round 2',
        'R3': 'Round 3',
        'EXT': 'Round 3 (Extended)',
        'MOCK': 'Mock Round 1',
    };
    return displayMap[round] || round;
}
