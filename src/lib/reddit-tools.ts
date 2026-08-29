/**
 * Reddit Knowledge Retrieval Tool for KCET Coded AI Counselor
 * Provides authentic student insights, reviews, campus culture, and counseling tips from Reddit
 */

export interface RedditInsight {
  id: string;
  source?: string;
  title: string;
  collegeCode?: string | null;
  collegeName?: string | null;
  category: string;
  author?: string;
  date?: string;
  upvotes: number;
  numComments: number;
  summary: string;
  keyTakeaways?: string[];
  pros?: string[];
  cons?: string[];
  url: string;
  // Fallbacks
  content?: string;
  subreddit?: string;
  score?: number;
  collegeCodes?: string[];
  categories?: string[];
}

let cachedInsights: RedditInsight[] | null = null;
let isFetchingInsights = false;

/**
 * Load Reddit knowledge base from public/data/reddit_kcet_insights.json
 */
export async function loadRedditInsights(): Promise<RedditInsight[]> {
  if (cachedInsights && cachedInsights.length > 0) return cachedInsights;
  if (isFetchingInsights) {
    while (isFetchingInsights) {
      await new Promise(r => setTimeout(r, 100));
      if (cachedInsights && cachedInsights.length > 0) return cachedInsights;
    }
  }

  isFetchingInsights = true;

  // 1. Browser environment fetch
  if (typeof window !== 'undefined') {
    const paths = [
      '/data/reddit_kcet_insights.json',
      '/public/data/reddit_kcet_insights.json',
      './data/reddit_kcet_insights.json'
    ];

    for (const path of paths) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            cachedInsights = data;
            isFetchingInsights = false;
            return data;
          }
        }
      } catch {
        continue;
      }
    }
  }

  isFetchingInsights = false;
  return [];
}

/**
 * Search Reddit student insights based on query keywords, college codes, or categories
 */
export async function searchRedditInsights(
  query: string,
  options?: {
    collegeCode?: string;
    category?: string;
    limit?: number;
  }
): Promise<{
  formatted: string;
  insights: RedditInsight[];
}> {
  const allInsights = await loadRedditInsights();
  if (!allInsights || allInsights.length === 0) {
    return {
      formatted: "No Reddit student discussion data loaded.",
      insights: []
    };
  }

  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['and', 'the', 'for', 'about', 'how', 'what', 'can', 'college', 'review'].includes(w));

  const limit = options?.limit || 4;

  const scored = allInsights.map(insight => {
    let score = 0;
    const lowerTitle = (insight.title || '').toLowerCase();
    const lowerSummary = (insight.summary || insight.content || '').toLowerCase();
    const insightCode = insight.collegeCode || (insight.collegeCodes && insight.collegeCodes[0]) || '';

    // Match college code if specified
    if (options?.collegeCode && insightCode.toUpperCase() === options.collegeCode.toUpperCase()) {
      score += 25;
    }

    // Match category if specified
    if (options?.category && (insight.category === options.category || (insight.categories && insight.categories.includes(options.category)))) {
      score += 12;
    }

    // Match query terms
    for (const term of queryTerms) {
      if (lowerTitle.includes(term)) score += 8;
      if (lowerSummary.includes(term)) score += 4;
      if (insightCode.toLowerCase() === term) score += 15;
      if (insight.collegeName?.toLowerCase().includes(term)) score += 10;
    }

    // Engagement weighting
    const votes = insight.upvotes || insight.score || 0;
    score += Math.min(votes / 30, 4);

    return { insight, score };
  });

  const matched = scored
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.insight);

  if (matched.length === 0) {
    // Fallback: take top general advice
    const fallback = allInsights.slice(0, 2);
    return {
      formatted: formatInsightsForAI(fallback),
      insights: fallback
    };
  }

  return {
    formatted: formatInsightsForAI(matched),
    insights: matched
  };
}

/**
 * Format Reddit insights into structured context for the AI prompt
 */
function formatInsightsForAI(insights: RedditInsight[]): string {
  if (!insights || insights.length === 0) return "No relevant Reddit discussions found.";

  const items = insights.map((item, idx) => {
    const takeaways = item.keyTakeaways && item.keyTakeaways.length > 0
      ? item.keyTakeaways.map(t => `  - ${t}`).join('\n')
      : `  - ${item.summary || item.content}`;

    const prosText = item.pros && item.pros.length > 0 ? `\n- **Pros Noted**: ${item.pros.join(', ')}` : '';
    const consText = item.cons && item.cons.length > 0 ? `\n- **Cons Noted**: ${item.cons.join(', ')}` : '';

    return [
      `### [r/kcet Senior Discussion #${idx + 1}] ${item.title}`,
      `- **Topic**: ${item.category} ${item.collegeName ? `| **College**: ${item.collegeName} (${item.collegeCode || ''})` : ''}`,
      `- **Engagement**: 👍 ${item.upvotes || item.score || 1} upvotes | 💬 ${item.numComments || 0} comments | Source: ${item.source || 'r/kcet'}`,
      `- **Key Senior Takeaways**:`,
      takeaways,
      prosText,
      consText,
      `- **Reddit Link**: ${item.url}`
    ].filter(Boolean).join('\n');
  });

  return [
    `=== AUTHENTIC STUDENT & SENIOR INTELLIGENCE (TRAINED ON r/kcet & r/bangalore) ===`,
    `Use these real student perspectives, senior reviews, hostel realities, document rules, and placement facts to inform your response:`,
    '',
    items.join('\n\n---\n\n')
  ].join('\n');
}
