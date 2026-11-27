import type { VercelRequest, VercelResponse } from '@vercel/node';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const PRIMARY_MODEL = 'nvidia/nemotron-3-super-120b-a12b';
const FALLBACK_MODEL = 'meta/llama-3.3-70b-instruct';

async function callGemini(
  messages: Array<{ role: string; content: string }>
): Promise<{ text: string | null; error?: string }> {
  if (!GEMINI_API_KEY) return { text: null, error: 'GEMINI_API_KEY not set' };
  const systemMsg = messages.find((m) => m.role === 'system')?.content;
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const errors: string[] = [];
  for (const model of ['gemini-2.5-flash', 'gemini-2.0-flash']) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(systemMsg ? { systemInstruction: { parts: [{ text: systemMsg }] } } : {}),
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';
      if (text.trim()) return { text: text.trim() };
      errors.push(`${model}: empty`);
    } else {
      const errBody = await res.text().catch(() => '');
      errors.push(`${model}: HTTP ${res.status} ${errBody.slice(0, 120)}`);
    }
  }
  return { text: null, error: errors.join(' | ') };
}

async function callNvidia(messages: unknown[], model: string, withThinking: boolean) {
  return fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: withThinking ? 1 : 0.4,
      top_p: 0.95,
      max_tokens: withThinking ? 16384 : 2048,
      ...(withThinking ? { chat_template_kwargs: { enable_thinking: true }, reasoning_budget: 16384 } : {}),
      stream: true,
    }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY && !NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'No AI API key configured' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Prefer Gemini Flash when GEMINI_API_KEY is configured
    const geminiResult = await callGemini(messages);
    if (geminiResult.text) {
      return res.status(200).json({ content: geminiResult.text });
    }

    if (!NVIDIA_API_KEY) {
      return res.status(502).json({ error: `Gemini failed (${geminiResult.error}) and NVIDIA_API_KEY is not configured` });
    }

    // Call NVIDIA API with streaming (fallback to Llama 3.3 70B if primary model is 404/410)
    let response = await callNvidia(messages, PRIMARY_MODEL, true);
    if (response.status === 404 || response.status === 410) {
      response = await callNvidia(messages, FALLBACK_MODEL, false);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`NVIDIA API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({
        error: `NVIDIA API error: ${response.status}`,
        details: errorText,
      });
    }

    // Collect the streamed response into a single text
    const reader = response.body?.getReader();
    if (!reader) {
      return res.status(500).json({ error: 'No response body from NVIDIA' });
    }

    let fullContent = '';
    let fullReasoning = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (!delta) continue;

          // Collect reasoning content (thinking)
          if (delta.reasoning_content) {
            fullReasoning += delta.reasoning_content;
          }
          // Collect actual content
          if (delta.content) {
            fullContent += delta.content;
          }
        } catch {
          // Skip unparseable chunks
        }
      }
    }

    // Return the combined response (only the final content, not reasoning)
    return res.status(200).json({
      content: fullContent,
      reasoning: fullReasoning,
      model: PRIMARY_MODEL,
    });
  } catch (error) {
    console.error('NVIDIA chat handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
