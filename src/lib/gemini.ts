// OpenRouter AI Integration for KCET Counselor
// Using OpenAI-compatible API format with fallback model

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DATA_URL = '/data/kcet_cutoffs_consolidated.json';

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

interface CutoffData {
    cutoffs: CutoffEntry[];
    metadata: any;
}

// Cache for the heavy dataset
let cachedData: CutoffEntry[] | null = null;
let isFetching = false;

const SYSTEM_PROMPT = `You are KCET Coded AI - an expert counselor for Karnataka CET (KCET) engineering admissions. You help students with:

1. **College Selection**: Suggest colleges based on rank, category, and preferred branches
2. **Cutoff Analysis**: Explain cutoff trends and what ranks are needed for specific colleges
3. **Counseling Process**: Guide through document verification, choice filling, and seat allotment
4. **Branch Guidance**: Help students choose between branches based on interests and career goals
5. **General KCET Queries**: Answer any questions about KCET admissions

Key Facts You Know:
- KCET 2025 counseling has multiple rounds (Mock, Round 1, Round 2, Round 3/Extended)
- Categories: GM (General Merit), SC, ST, 1G, 2A, 2B, 3A, 3B
- Top colleges include: RVCE, BMSCE, MSRIT, PESIT, JSSATE, NITK, UVCE
- Popular branches: CSE, ISE, ECE, EEE, Mechanical, Civil, AI&ML, Data Science
- VTU is the affiliating university for most engineering colleges in Karnataka

Response Guidelines:
- Be concise and helpful
- Use bullet points for lists
- Give specific rank ranges when possible
- Always mention that cutoffs vary year to year
- Be encouraging and supportive
- If unsure, say so honestly and suggest checking official KEA website
- Use emojis sparingly to be friendly 🎓

**IMPORTANT**: If you are provided with "Context Data" from the official database, USE IT. It contains real cutoff ranks. Cite the specific years and ranks from the data. If the data doesn't contain the exact answer, say so.`;

// Keywords to ignore in search
const STOP_WORDS = new Set([
    'can', 'i', 'get', 'for', 'rank', 'and', 'category', 'cat', 'college', 'in', 'the', 'a', 'an', 'is',
    'what', 'how', 'best', 'top', 'list', 'cutoff', 'cutoffs', 'seat', 'seats', 'round',
    'admission', 'engineering', 'branch', 'course', 'quota', 'bangalore', 'mysore', 'karnataka',
    'available', 'possible', 'chances', 'tell', 'me', 'about', 'vs', 'better'
]);

async function fetchCutoffData(onStatus: (status: string) => void): Promise<CutoffEntry[]> {
    if (cachedData) return cachedData;
    if (isFetching) {
        // Wait for existing fetch
        while (isFetching) {
            await new Promise(r => setTimeout(r, 100));
            if (cachedData) return cachedData;
        }
    }

    isFetching = true;
    onStatus("Downloading 200k+ records from database...");

    try {
        // Try multiple paths just in case
        const paths = [
            '/data/kcet_cutoffs_consolidated.json',
            '/public/data/kcet_cutoffs_consolidated.json',
            '/kcet_cutoffs_consolidated.json'
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
            throw new Error("Failed to load cutoff data file");
        }

        onStatus("Processing data...");
        const json = await response.json();

        // Handle different structures
        if (Array.isArray(json)) {
            cachedData = json;
        } else if (json.cutoffs && Array.isArray(json.cutoffs)) {
            cachedData = json.cutoffs;
        } else {
            cachedData = [];
        }

        return cachedData || [];
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
        .filter(t => t.length > 1 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));

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

        if (status === 429 || status === 404 || status === 503) {
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

export async function sendMessage(
    userMessage: string,
    conversationHistory: Message[],
    onStatusUpdate?: (status: string) => void
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
    }

    // RAG Logic: Check if we need real data
    let contextData = "";
    const lowerMsg = userMessage.toLowerCase();
    const needsData = lowerMsg.includes('cutoff') ||
        lowerMsg.includes('rank') ||
        lowerMsg.includes('college') ||
        lowerMsg.includes('seat') ||
        /E\d{3}/i.test(userMessage);

    if (needsData && onStatusUpdate) {
        try {
            // Fetch
            const data = await fetchCutoffData(onStatusUpdate);

            // Search
            onStatusUpdate("Scanning for relevant info...");
            const relevantRecords = searchRelevantData(userMessage, data);

            if (relevantRecords.length > 0) {
                contextData = `\n\nREAL DATA CONTEXT (Use this to answer): \n${JSON.stringify(relevantRecords, null, 2)}`;
                onStatusUpdate(`Found ${relevantRecords.length} relevant records...`);
            } else {
                onStatusUpdate("No specific records found, using general knowledge...");
            }
        } catch (e) {
            console.error("RAG failed:", e);
            // Continue without data context
        }
    }

    // Build messages array
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT + contextData },
        ...conversationHistory.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        })),
        { role: 'user', content: userMessage }
    ];

    if (onStatusUpdate) onStatusUpdate("AI is thinking...");

    // Try each model in order
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
