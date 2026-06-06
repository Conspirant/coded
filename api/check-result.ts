import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://qrdgvugivkqkfilodsbc.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZGd2dWdpdmtxa2ZpbG9kc2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDk4MTcsImV4cCI6MjA4NzY4NTgxN30.0DpoalYldwlQT940rtGGcvhH4vpXgfEJKSwADZzLNdk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const KEA_URL = 'https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php';

// Helper to fetch url with a timeout using AbortController
async function fetchWithTimeout(url: string, options: any, timeoutMs: number = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Resilient regex parser to extract candidate scorecard
function parseKearHTML(html: string) {
  const extractVal = (idPattern: string): string => {
    const regex = new RegExp(`id=["']${idPattern}["'][^>]*>([^<]*)`, 'i');
    const match = html.match(regex);
    return match ? match[1].trim() : "";
  };

  let name = extractVal('lblname') || extractVal('lblvalueName') || extractVal('Name');
  let regNo = extractVal('lblregno') || extractVal('lblRegNo') || extractVal('reg_no');

  // Fallbacks if element IDs are missing
  if (!name) {
    const nameMatch = html.match(/Candidate Name[^<]*:<\/td>[^<]*<td>([^<]*)/i) || html.match(/Name[^<]*:<\/th>[^<]*<td>([^<]*)/i);
    name = nameMatch ? nameMatch[1].trim() : "Candidate";
  }
  if (!regNo) {
    const regNoMatch = html.match(/Reg[^<]*No[^<]*:<\/td>[^<]*<td>([^<]*)/i) || html.match(/Application[^<]*No[^<]*:<\/td>[^<]*<td>([^<]*)/i);
    regNo = regNoMatch ? regNoMatch[1].trim() : "";
  }

  // Ranks parsing
  const getRank = (id: string, keyword: string): number | null => {
    const val = extractVal(id);
    if (val && !isNaN(parseInt(val))) return parseInt(val);
    
    // Backup search by label keyword
    const regex = new RegExp(`${keyword}[^<]*<\/td>[^<]*<td>([^<]*)`, 'i');
    const match = html.match(regex);
    if (match) {
      const parsed = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  };

  const engineering = getRank('lbleng', 'Engineering');
  const agriculture = getRank('lblagri', 'Agriculture');
  const veterinary = getRank('lblvet', 'Veterinary');
  const ayush = getRank('lblayush', 'AYUSH');
  const bpharma = getRank('lblpharma', 'B-Pharma');
  const pharmd = getRank('lblpharmd', 'Pharm-D');

  // Marks parsing
  const getMarks = (id: string, keyword: string): number => {
    const val = extractVal(id);
    if (val && !isNaN(parseFloat(val))) return parseFloat(val);

    const regex = new RegExp(`${keyword}[^<]*<\/td>[^<]*<td>([^<]*)`, 'i');
    const match = html.match(regex);
    if (match) {
      const parsed = parseFloat(match[1].replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  };

  const physics = getMarks('lblphy', 'Physics');
  const chemistry = getMarks('lblchem', 'Chemistry');
  const maths = getMarks('lblmath', 'Mathematics');
  const biology = getMarks('lblbio', 'Biology');

  return {
    name,
    regNo,
    ranks: {
      engineering,
      agriculture,
      veterinary,
      ayush,
      bpharma,
      pharmd
    },
    marks: {
      physics,
      chemistry,
      maths,
      biology
    }
  };
}

// Generate test data for local simulation/demo
const getMockResult = (applNo: string, dob: string) => {
  // Seed random generator with applNo to keep values consistent per student
  let seed = 0;
  for (let i = 0; i < applNo.length; i++) {
    seed += applNo.charCodeAt(i);
  }
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  return {
    name: "Simulated Student " + applNo.slice(-4),
    regNo: applNo,
    ranks: {
      engineering: Math.floor(random() * 140000) + 120,
      agriculture: Math.floor(random() * 110000) + 200,
      veterinary: Math.floor(random() * 45000) + 50,
      ayush: Math.floor(random() * 75000) + 80,
      bpharma: Math.floor(random() * 95000) + 150,
      pharmd: Math.floor(random() * 38000) + 40
    },
    marks: {
      physics: Math.floor(random() * 30) + 20,
      chemistry: Math.floor(random() * 32) + 18,
      maths: Math.floor(random() * 35) + 15,
      biology: Math.floor(random() * 30) + 22
    },
    isMock: true
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { applNo, dob } = req.body as { applNo?: string; dob?: string };

  if (!applNo || !dob) {
    return res.status(400).json({ error: 'Application number (applNo) and Date of Birth (dob) are required' });
  }

  // Standardize inputs
  const cleanApplNo = applNo.trim().toUpperCase();
  const cleanDob = dob.trim(); // dd-mm-yyyy

  // 1. Check if mock testing is requested
  if (cleanApplNo.startsWith('TEST') || cleanApplNo === '26UG999999' || process.env.NODE_ENV === 'development' && cleanApplNo.startsWith('MOCK')) {
    const mockData = getMockResult(cleanApplNo, cleanDob);
    return res.status(200).json(mockData);
  }

  try {
    // 2. Query Supabase Cache First
    const { data: cachedRow, error: cacheError } = await supabase
      .from('ugcet_results_cache')
      .select('results_json')
      .eq('appl_no', cleanApplNo)
      .eq('dob', cleanDob)
      .single();

    if (cachedRow && cachedRow.results_json) {
      console.log(`[Cache Hit] Serving result for ${cleanApplNo}`);
      return res.status(200).json(cachedRow.results_json);
    }

    if (cacheError && cacheError.code !== 'PGRST116') {
      console.error('Database cache query error:', cacheError);
    }

    // 3. Query KEA Results Portal (Proxy Mode)
    console.log(`[Cache Miss] Querying KEA for ${cleanApplNo}`);
    let htmlContent = '';
    let fetchedSuccessfully = false;
    let retries = 3;
    let delay = 1000;

    const payload = new URLSearchParams();
    payload.append('reg_no', cleanApplNo);
    payload.append('dob', cleanDob);
    payload.append('Submit', 'Submit');

    while (retries > 0 && !fetchedSuccessfully) {
      try {
        const response = await fetchWithTimeout(KEA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Origin': 'https://keaonline.karnataka.gov.in',
            'Referer': 'https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php'
          },
          body: payload.toString()
        }, 8000); // 8 seconds timeout per attempt

        if (response.ok) {
          htmlContent = await response.text();
          fetchedSuccessfully = true;
        } else {
          console.warn(`KEA server returned status ${response.status}. Retries remaining: ${retries - 1}`);
        }
      } catch (fetchErr) {
        console.warn(`Fetch to KEA failed or timed out: ${fetchErr instanceof Error ? fetchErr.message : fetchErr}. Retries remaining: ${retries - 1}`);
      }

      if (!fetchedSuccessfully) {
        retries--;
        if (retries > 0) {
          // Exponential backoff delay
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5;
        }
      }
    }

    // 4. Handle persistent KEA connection failures
    if (!fetchedSuccessfully) {
      // Fallback for development testing when KEA server is offline
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Dev Fallback] KEA offline. Serving simulated result.`);
        const devMock = getMockResult(cleanApplNo, cleanDob);
        return res.status(200).json({ ...devMock, _offlineFallback: true });
      }

      return res.status(503).json({
        error: 'KEA Server Busy',
        message: 'The official KEA results portal is currently overloaded or down. Please wait a moment and try again.'
      });
    }

    // 5. Parse and validation checks
    // If KEA says "Invalid Registration Number" or "No results found"
    if (htmlContent.includes('Invalid') || htmlContent.includes('not found') || htmlContent.includes('incorrect') || htmlContent.includes('Enter Correct')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Invalid Application Number or Date of Birth entered. Please verify your details.'
      });
    }

    const parsedResult = parseKearHTML(htmlContent);

    // Check if any rank was successfully parsed — if not, credentials are invalid
    const hasAnyRank = Object.values(parsedResult.ranks).some(r => r !== null);
    if (!hasAnyRank) {
      return res.status(404).json({
        error: 'Invalid Credentials',
        message: 'Invalid Application Number or Date of Birth. Please check your credentials and try again.'
      });
    }

    // If we couldn't parse name/registration number, it might be a broken HTML page
    if (!parsedResult.regNo && !parsedResult.name) {
      return res.status(502).json({
        error: 'Parsing Failed',
        message: 'KEA returned page but structure was unrecognized. This may mean KEA updated their portal layout.'
      });
    }

    // 6. Write Result to Supabase Cache
    const { error: insertError } = await supabase
      .from('ugcet_results_cache')
      .upsert({
        appl_no: cleanApplNo,
        dob: cleanDob,
        name: parsedResult.name,
        results_json: parsedResult
      });

    if (insertError) {
      console.error('Error writing result to Supabase cache:', insertError);
    }

    return res.status(200).json(parsedResult);

  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred while proxying results.'
    });
  }
}
