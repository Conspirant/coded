// OpenRouter AI Integration for KCET Counselor
// Using OpenAI-compatible API format with fallback model

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

Keep responses focused and under 300 words unless the question requires detailed explanation.`;

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
        console.warn(`Model ${model} failed with status ${status}`);

        // Retry with fallback for rate limits (429) or model not found (404)
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
    conversationHistory: Message[]
): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
    }

    // Build messages array
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        })),
        { role: 'user', content: userMessage }
    ];

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

            // Continue to next model
            console.log(`Falling back to next model...`);
        } catch (error) {
            if (error instanceof Error && error.message.includes('API key')) {
                throw error;
            }
            // Continue to next model
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
