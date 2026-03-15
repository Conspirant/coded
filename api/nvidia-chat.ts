import type { VercelRequest, VercelResponse } from '@vercel/node';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA API key not configured' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Call NVIDIA API with streaming
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 1,
        top_p: 0.95,
        max_tokens: 16384,
        extra_body: {
          chat_template_kwargs: { enable_thinking: true },
          reasoning_budget: 16384,
        },
        stream: true,
      }),
    });

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
      model: MODEL,
    });
  } catch (error) {
    console.error('NVIDIA chat handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
