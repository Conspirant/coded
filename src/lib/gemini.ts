// OpenRouter AI Integration for KCET Counselor
// Using OpenAI-compatible API format with fallback model

import { executeToolsForQuery } from './ai-tools';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Primary and fallback models (in order of preference)
const MODELS = [
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'nvidia/llama-3.1-nemotron-70b-instruct:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
];

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Data interfaces
interface CutoffEntry {
    institute: string;
    institute_code: string;
    course: string;
    category: string;
    cutoff_rank: number;
    year: string;
    round: string;
}

// Cache for the heavy dataset
let cachedData: CutoffEntry[] | null = null;
let isFetching = false;

const SYSTEM_PROMPT = `You are KCET Coded AI - an expert counselor for Karnataka CET (KCET) engineering admissions. You have access to REAL DATA tools that provide accurate information.

## YOUR CAPABILITIES:

### 1. Rank Prediction 🎯
You can predict KCET ranks when given:
- KCET marks (out of 180)
- PUC/12th percentage
Formula: Composite Score = (KCET marks / 180 × 100 + PUC%) / 2

### 2. College Finder 🏫
You can find eligible colleges based on:
- Student's rank
- Category (GM, 2A, 3B, SC, ST, etc.)
- Preferred course/branch
- Year data (2023, 2024, 2025)

### 3. Cutoff Lookup 📊
You can look up historical cutoffs for:
- Specific colleges (RVCE, BMSCE, MSRIT, etc.)
- Specific courses (CSE, ECE, ISE, etc.)
- Different categories and rounds

## CALIBRATED RANK TABLE (2025 REAL DATA — ALWAYS USE THIS):
Use linear interpolation between these data points for rank prediction:
| Composite % | Rank   |
|-------------|--------|
| 96.22%      | 81     |
| 94.06%      | 308    |
| 90.00%      | 1,245  |
| 85.00%      | 3,804  |
| 80.00%      | 8,500  |
| 75.00%      | 16,000 |
| 70.00%      | 30,000 |
| 65.00%      | 50,000 |
| 60.00%      | 80,000 |
| 50.00%      | 1,55,000 |
| 40.00%      | 2,35,000 |
| 35.00%      | 2,59,000 |
| 30.00%      | 2,80,000 |

Variance range: predicted rank ± 3,000 to 5,000 (due to category/competition variance).

## COLLEGE SUGGESTIONS BY RANK (General Merit):
| Rank Range   | Colleges                         | Branches              |
|--------------|----------------------------------|-----------------------|
| ≤ 200        | RVCE, BMSCE, IISc                | CSE, ECE, EEE         |
| ≤ 1,200      | MSRIT, PESIT, BMSIT              | CSE, ECE, ISE         |
| ≤ 3,000      | SIT, NMIT, DSCE                  | CSE, ECE, ME          |
| ≤ 8,000      | CIT, SJCE, UVCE                  | All branches          |
| ≤ 16,000     | Regional top colleges            | All branches          |
| ≤ 30,000     | Private reputed colleges         | All branches          |
| ≤ 70,000     | Regional engineering colleges    | All branches          |
| ≤ 1,00,000   | Private engineering colleges     | All branches          |

## Key Facts:
- KCET 2025 has rounds: Mock, Round 1, Round 2, Round 3/Extended
- Categories: GM, SC, ST, 1G, 2A, 2B, 3A, 3B (with R/K variants for rural/Kannada medium)
- Top colleges: RVCE, BMSCE, MSRIT, PESIT, JSSATE, NITK, UVCE
- Popular branches: CSE, ISE, ECE, EEE, Mechanical, Civil, AI&ML, Data Science
- VTU affiliates most Karnataka engineering colleges
- Total candidates (2025): ~2,59,000

## Response Guidelines:
- **ALWAYS use the CALIBRATED RANK TABLE above** for rank predictions — NEVER use your own training data
- When predicting ranks: show Composite Score calculation, then interpolate from the table
- **USE THE TOOL RESULTS** provided in the context - they contain REAL DATA from the website
- Quote specific ranks and years from the data
- Be concise and use bullet points
- Be encouraging and supportive 🎓
- If data is missing, acknowledge it and suggest the KEA website

**CRITICAL**: When you see "TOOL RESULTS" in the context, base your response on that data. Explain it clearly to the student. For rank predictions, ALWAYS use the calibrated table above — do NOT make up your own rank estimates.`;

// Keywords to ignore in search
const STOP_WORDS = new Set([
    'can', 'i', 'get', 'for', 'rank', 'and', 'category', 'cat', 'college', 'in', 'the', 'a', 'an', 'is',
    'what', 'how', 'best', 'top', 'list', 'cutoff', 'cutoffs', 'seat', 'seats', 'round',
    'admission', 'engineering', 'branch', 'course', 'quota', 'bangalore', 'mysore', 'karnataka',
    'available', 'possible', 'chances', 'tell', 'me', 'about', 'vs', 'better'
]);

async function fetchCutoffData(onStatus: (status: string) => void): Promise<CutoffEntry[]> {
    if (cachedData && cachedData.length > 0) return cachedData;
    if (isFetching) {
        // Wait for existing fetch
        while (isFetching) {
            await new Promise(r => setTimeout(r, 100));
            if (cachedData && cachedData.length > 0) return cachedData;
        }
    }

    isFetching = true;
    const allData: CutoffEntry[] = [];

    try {
        // Parallel loading of years
        const files = ['2023', '2024', '2025'];

        onStatus(`Initializing data download (${files.length} files)...`);

        const promises = files.map(async (year) => {
            try {
                // Try multiple paths just in case
                const paths = [
                    `/data/cutoffs-${year}.json`,
                    `/public/data/cutoffs-${year}.json`,
                    `/cutoffs-${year}.json`
                ];

                let response: Response | null = null;
                for (const path of paths) {
                    try {
                        const res = await fetch(path);
                        if (res.ok) {
                            response = res;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!response) {
                    console.warn(`Could not load ${year} data`);
                    return [];
                }

                const json = await response.json();
                return Array.isArray(json) ? json : (json.cutoffs || []);
            } catch (e) {
                console.error(`Error loading ${year}:`, e);
                return [];
            }
        });

        const results = await Promise.all(promises);
        results.forEach(yearData => allData.push(...yearData));

        cachedData = allData;

        if (allData.length === 0) {
            throw new Error("No data could be loaded from any file");
        }

        return allData;
    } catch (error) {
        console.error("Data fetch error:", error);
        return [];
    } finally {
        isFetching = false;
    }
}

function searchRelevantData(query: string, data: CutoffEntry[]): CutoffEntry[] {
    // Clean query and remove stop words
    const terms = query.toLowerCase()
        .replace(/[?.,!-]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 1 && !STOP_WORDS.has(t));

    // Extract explicit rank if present
    const rankMatch = query.match(/(\d{3,6})/); // numbers 100-999999

    // College codes regex (E001, E123 etc)
    const codeMatch = query.toUpperCase().match(/E\d{3}/);
    const targetCode = codeMatch ? codeMatch[0] : null;

    if (terms.length === 0 && !targetCode && !rankMatch) return [];

    console.log("Search terms:", terms, "Code:", targetCode, "Rank:", rankMatch);

    return data.filter(item => {
        // Strict code match if present
        if (targetCode && item.institute_code !== targetCode) return false;

        let score = 0;
        const itemText = `${item.institute} ${item.course} ${item.category} ${item.institute_code} ${item.year}`.toLowerCase();

        // Keywords matching
        for (const term of terms) {
            if (itemText.includes(term)) score += 1;
        }

        // Boost if category matches exactly
        const queryCategory = query.match(/\b(1G|1R|1K|2AG|2AR|2AK|2BG|2BR|2BK|3AG|3AR|3AK|3BG|3BR|3BK|GM|GMR|GMK|SCG|SCR|SCK|STG|STR|STK)\b/i);
        if (queryCategory && item.category.toLowerCase() === queryCategory[0].toLowerCase()) {
            score += 2;
        }

        // Boost for recent years
        if (item.year === '2024') score += 1;
        if (item.year === '2025') score += 2;

        // If target code is present, include it regardless of other scores
        if (targetCode) return true;

        // Dynamic threshold
        // e.g. "sai vidya" -> 2 terms -> need 1 match
        const requiredScore = Math.max(1, Math.floor(terms.length * 0.5));
        return score >= requiredScore;
    })
        .sort((a, b) => {
            // Sort by year (desc)
            return b.year.localeCompare(a.year);
        })
        .slice(0, 50);
}

async function tryModel(
    model: string,
    messages: Array<{ role: string; content: string }>
): Promise<{ success: boolean; content?: string; shouldRetry: boolean }> {
    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'KCET Coded AI Counselor'
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 1024,
        }),
    });

    if (!response.ok) {
        const status = response.status;
        const errorBody = await response.text().catch(() => 'No error body');
        console.error(`Model ${model} failed - Status: ${status}, Body: ${errorBody}`);

        if (status === 429 || status === 404 || status === 503 || status === 524) { // Added 524 for timeouts
            return { success: false, shouldRetry: true };
        }

        if (status === 401) {
            throw new Error('Invalid API key. Please check your OpenRouter API key.');
        }

        return { success: false, shouldRetry: false };
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
        return { success: false, shouldRetry: true };
    }

    return { success: true, content: data.choices[0].message.content, shouldRetry: false };
}

async function tryNvidiaModel(
    messages: Array<{ role: string; content: string }>
): Promise<{ success: boolean; content?: string }> {
    try {
        const response = await fetch('/api/nvidia-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
            console.warn(`NVIDIA proxy returned ${response.status}`);
            return { success: false };
        }

        const data = await response.json();
        if (data.content) {
            return { success: true, content: data.content };
        }
        return { success: false };
    } catch (error) {
        console.warn('NVIDIA model failed:', error);
        return { success: false };
    }
}

export async function sendMessage(
    userMessage: string,
    conversationHistory: Message[],
    onStatusUpdate?: (status: string) => void
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
    }

    // AI Tools: Execute specialized tools first for structured data
    let toolContext = "";
    if (onStatusUpdate) onStatusUpdate("Analyzing your question...");
    try {
        toolContext = await executeToolsForQuery(userMessage);
        if (toolContext && onStatusUpdate) {
            onStatusUpdate("Found relevant data using AI tools...");
        }
    } catch (e) {
        console.error("Tool execution failed:", e);
    }

    // RAG Logic: Also fetch cutoff data for data-heavy queries (complements tool results)
    let contextData = "";
    const lowerMsg = userMessage.toLowerCase();
    const needsData = (
        lowerMsg.includes('cutoff') ||
        lowerMsg.includes('rank') ||
        lowerMsg.includes('college') ||
        lowerMsg.includes('seat') ||
        lowerMsg.includes('branch') ||
        lowerMsg.includes('marks') ||
        lowerMsg.includes('kcet') ||
        lowerMsg.includes('predict') ||
        /E\d{3}/i.test(userMessage) ||
        /\d{3,6}/.test(userMessage)
    );

    if (needsData) {
        try {
            const statusFn = onStatusUpdate || (() => {});
            // Fetch
            const data = await fetchCutoffData(statusFn);
            if (onStatusUpdate) onStatusUpdate(`Loaded ${data.length} records. Scanning...`);

            // Search
            const relevantRecords = searchRelevantData(userMessage, data);

            if (relevantRecords.length > 0) {
                contextData = `\n\nREAL CUTOFF DATA FROM WEBSITE (Use this to answer): \n${JSON.stringify(relevantRecords, null, 2)}`;
                if (onStatusUpdate) onStatusUpdate(`Found ${relevantRecords.length} matches for "${userMessage.substring(0, 15)}..."`);
            } else {
                if (onStatusUpdate) onStatusUpdate("No matching cutoff data found.");
            }
        } catch (e) {
            console.error("RAG failed:", e);
            // Continue without data context
        }
    }

    // Combine tool results and RAG context
    const fullContext = toolContext + contextData;


    // Build messages array
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT + fullContext },
        ...conversationHistory.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        })),
        { role: 'user', content: userMessage }
    ];

    if (onStatusUpdate) onStatusUpdate("AI is thinking...");

    // Try NVIDIA Nemotron first (primary model)
    console.log('Trying primary model: NVIDIA Nemotron-3 Super 120B');
    if (onStatusUpdate) onStatusUpdate("Using NVIDIA Nemotron (primary)...");

    const nvidiaResult = await tryNvidiaModel(messages);
    if (nvidiaResult.success && nvidiaResult.content) {
        return nvidiaResult.content;
    }

    console.log('NVIDIA model unavailable, falling back to OpenRouter models...');
    if (onStatusUpdate) onStatusUpdate('Trying alternative AI model...');

    // Fallback: Try each OpenRouter model in order
    for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i];
        console.log(`Trying model: ${model}`);

        try {
            const result = await tryModel(model, messages);

            if (result.success && result.content) {
                return result.content;
            }

            if (!result.shouldRetry) {
                throw new Error(`API request failed`);
            }

            console.log(`Falling back to next model...`);
            if (onStatusUpdate) onStatusUpdate(`Trying alternative AI model...`);
        } catch (error) {
            if (error instanceof Error && error.message.includes('API key')) {
                throw error;
            }
            console.warn(`Error with model ${model}:`, error);
        }
    }

    throw new Error('All AI models are currently unavailable. Please try again in a moment.');
}

// Quick suggestion prompts
export const QUICK_PROMPTS = [
    "What colleges can I get with rank 10,000 in GM?",
    "CSE vs AI&ML - which branch is better?",
    "What documents do I need for counseling?",
    "Explain the choice filling process",
    "Best colleges for ECE in Bangalore",
    "Is RVCE better than BMSCE?",
];
