import type { VercelRequest, VercelResponse } from '@vercel/node';

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b';

type Candidate = {
  id: string;
  collegeCode: string;
  collegeName: string;
  branchName: string;
  cutoff: number;
  category: string;
  qualityScore: number;
};

const extractJson = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return raw.slice(start, end + 1);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA API key not configured' });
  }

  try {
    const { candidates, limit, rank, category, round, year, branches } = req.body as {
      candidates?: Candidate[];
      limit?: number;
      rank?: number;
      category?: string;
      round?: string;
      year?: string;
      branches?: string[];
    };

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: 'candidates array is required' });
    }

    const safeLimit = Math.max(5, Math.min(Number(limit) || 30, candidates.length));
    const compactCandidates = candidates.slice(0, 260).map(candidate => ({
      id: candidate.id,
      code: candidate.collegeCode,
      college: candidate.collegeName.slice(0, 120),
      branch: candidate.branchName.slice(0, 80),
      cutoff: candidate.cutoff,
      category: candidate.category,
      qualityScore: candidate.qualityScore,
    }));

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: [
              'You are an expert KCET option-entry list ranker.',
              'Rank engineering college-course candidates for Karnataka counselling.',
              'Prefer stronger colleges by placements, infrastructure, faculty, brand, location, alumni network, autonomy/university strength, and student outcomes.',
              'Also respect cutoff fit: do not put only impossible dream options first; maintain a practical list with realistic and safe backups.',
              'Return ONLY valid JSON with this shape: {"orderedIds":["id1","id2"]}.',
              'Do not include explanations, markdown, or extra keys.',
            ].join(' '),
          },
          {
            role: 'user',
            content: JSON.stringify({
              student: { rank, category, year, round, preferredStreams: branches, requestedOptions: safeLimit },
              candidates: compactCandidates,
              instruction: `Return up to ${safeLimit} candidate ids in best option-entry order. If two options have similar cutoff fit, prefer the better college quality.`,
            }),
          },
        ],
        temperature: 0.25,
        top_p: 0.9,
        max_tokens: 4096,
        stream: false,
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => 'Unknown error');
      return res.status(response.status).json({ error: `NVIDIA API error: ${response.status}`, details });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';
    const jsonText = extractJson(content);
    if (!jsonText) {
      return res.status(502).json({ error: 'AI returned non-JSON content' });
    }

    const parsed = JSON.parse(jsonText) as { orderedIds?: unknown };
    const orderedIds = Array.isArray(parsed.orderedIds)
      ? parsed.orderedIds.filter((id): id is string => typeof id === 'string')
      : [];

    return res.status(200).json({ orderedIds: orderedIds.slice(0, safeLimit), model: MODEL });
  } catch (error) {
    return res.status(500).json({
      error: 'AI lister failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
