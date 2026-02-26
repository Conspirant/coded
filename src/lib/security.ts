import DOMPurify from 'dompurify';

// Input validation constants
export const VALIDATION_LIMITS = {
  MAX_REVIEW_LENGTH: 2500,
  MAX_COMMENT_LENGTH: 500,
  MAX_COLLEGE_NAME_LENGTH: 200,
  MAX_USER_NAME_LENGTH: 100,
  MIN_RATING: 1,
  MAX_RATING: 5,
  MAX_RANK: 1000000,
  MIN_RANK: 1,
  MAX_MARKS: 180,
  MIN_MARKS: 0,
  MAX_PERCENTAGE: 100,
  MIN_PERCENTAGE: 0,
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  REVIEW_SUBMISSION: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 3, // 3 reviews per minute
  },
  GENERAL_API: {
    WINDOW_MS: 60000, // 1 minute
    MAX_REQUESTS: 30, // 30 requests per minute
  },
} as const;

// Rate limiting storage
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize plain text input
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize review text
 */
export function validateReviewText(text: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitized: '', error: 'Review text is required' };
  }

  if (text.length > VALIDATION_LIMITS.MAX_REVIEW_LENGTH) {
    return {
      isValid: false,
      sanitized: '',
      error: `Review text must be less than ${VALIDATION_LIMITS.MAX_REVIEW_LENGTH} characters`
    };
  }

  if (text.length < 10) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Review text must be at least 10 characters long'
    };
  }

  const sanitized = sanitizeText(text);
  return { isValid: true, sanitized };
}

/**
 * Validate rating input
 */
export function validateRating(rating: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(rating)) {
    return { isValid: false, error: 'Rating must be a whole number' };
  }

  if (rating < VALIDATION_LIMITS.MIN_RATING || rating > VALIDATION_LIMITS.MAX_RATING) {
    return {
      isValid: false,
      error: `Rating must be between ${VALIDATION_LIMITS.MIN_RATING} and ${VALIDATION_LIMITS.MAX_RATING}`
    };
  }

  return { isValid: true };
}

/**
 * Validate KCET marks
 */
export function validateKCETMarks(marks: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(marks)) {
    return { isValid: false, error: 'Marks must be a whole number' };
  }

  if (marks < VALIDATION_LIMITS.MIN_MARKS || marks > VALIDATION_LIMITS.MAX_MARKS) {
    return {
      isValid: false,
      error: `Marks must be between ${VALIDATION_LIMITS.MIN_MARKS} and ${VALIDATION_LIMITS.MAX_MARKS}`
    };
  }

  return { isValid: true };
}

/**
 * Validate PUC percentage
 */
export function validatePUCPercentage(percentage: number): { isValid: boolean; error?: string } {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return { isValid: false, error: 'Percentage must be a valid number' };
  }

  if (percentage < VALIDATION_LIMITS.MIN_PERCENTAGE || percentage > VALIDATION_LIMITS.MAX_PERCENTAGE) {
    return {
      isValid: false,
      error: `Percentage must be between ${VALIDATION_LIMITS.MIN_PERCENTAGE} and ${VALIDATION_LIMITS.MAX_PERCENTAGE}`
    };
  }

  return { isValid: true };
}

/**
 * Validate rank input
 */
export function validateRank(rank: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(rank)) {
    return { isValid: false, error: 'Rank must be a whole number' };
  }

  if (rank < VALIDATION_LIMITS.MIN_RANK || rank > VALIDATION_LIMITS.MAX_RANK) {
    return {
      isValid: false,
      error: `Rank must be between ${VALIDATION_LIMITS.MIN_RANK} and ${VALIDATION_LIMITS.MAX_RANK}`
    };
  }

  return { isValid: true };
}

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(key: string, limit: typeof RATE_LIMITS.REVIEW_SUBMISSION | typeof RATE_LIMITS.GENERAL_API): {
  allowed: boolean;
  remaining: number;
  resetTime: number
} {
  const now = Date.now();
  const stored = rateLimitMap.get(key);

  if (!stored || now > stored.resetTime) {
    // Reset or create new entry
    const newEntry = {
      count: 1,
      resetTime: now + limit.WINDOW_MS,
    };
    rateLimitMap.set(key, newEntry);
    return {
      allowed: true,
      remaining: limit.MAX_REQUESTS - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (stored.count >= limit.MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: stored.resetTime,
    };
  }

  // Increment count
  stored.count++;
  rateLimitMap.set(key, stored);

  return {
    allowed: true,
    remaining: limit.MAX_REQUESTS - stored.count,
    resetTime: stored.resetTime,
  };
}

/**
 * Get user identifier for rate limiting
 */
export function getUserIdentifier(): string {
  // Try to get user session ID from localStorage
  const sessionId = localStorage.getItem('user_session_id');
  if (sessionId) {
    return `user_${sessionId}`;
  }

  // Fallback to a temporary identifier (less reliable)
  return `temp_${Date.now()}`;
}

/**
 * Validate college code format
 */
export function validateCollegeCode(code: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!code || typeof code !== 'string') {
    return { isValid: false, sanitized: '', error: 'College code is required' };
  }

  const sanitized = sanitizeText(code).toUpperCase();

  if (sanitized.length < 2 || sanitized.length > 20) {
    return {
      isValid: false,
      sanitized: '',
      error: 'College code must be between 2 and 20 characters'
    };
  }

  // Allow only alphanumeric characters and common separators
  if (!/^[A-Z0-9_-]+$/.test(sanitized)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'College code can only contain letters, numbers, hyphens, and underscores'
    };
  }

  return { isValid: true, sanitized };
}

/**
 * Validate category input
 */
export function validateCategory(category: string): { isValid: boolean; sanitized: string; error?: string } {
  const validCategories = ['1G', '2A', '2B', '3A', '3B', 'GM', 'SC', 'ST'];

  if (!category || typeof category !== 'string') {
    return { isValid: false, sanitized: '', error: 'Category is required' };
  }

  const sanitized = sanitizeText(category).toUpperCase();

  if (!validCategories.includes(sanitized)) {
    return {
      isValid: false,
      sanitized: '',
      error: `Category must be one of: ${validCategories.join(', ')}`
    };
  }

  return { isValid: true, sanitized };
}

// ─── Spam / Profanity Filter ───────────────────────────────────

/** Curated profanity list — word-boundary matched to avoid false positives */
const PROFANITY_LIST: string[] = [
  // English
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'dick', 'cunt',
  'piss', 'cock', 'whore', 'slut', 'nigger', 'faggot', 'retard',
  'motherfucker', 'asshole', 'bullshit', 'crap', 'dumbass', 'jackass',
  // Transliterated Hindi/Kannada slang
  'chutiya', 'madarchod', 'bhenchod', 'gaand', 'lund', 'randi',
  'bhosdike', 'harami', 'saala', 'kamina', 'suwwar', 'bevda',
  'myre', 'sule', 'bolimaga', 'naayi', 'haalu',
];

/** Build regex from word list — matches whole words only */
const buildProfanityRegex = (): RegExp => {
  // Escape special regex chars and join with word boundaries
  const escaped = PROFANITY_LIST.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
};

const PROFANITY_REGEX = buildProfanityRegex();

/** Detect URLs / links */
const URL_REGEX = /(?:https?:\/\/|www\.)\S+|[\w.-]+\.(?:com|org|net|in|io|co|xyz|info|biz|me|dev|app|site|online|shop|store|tech|edu|gov)\b/gi;

/** Detect phone numbers (Indian format) */
const PHONE_REGEX = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g;

/** Detect email addresses */
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Check text content for spam / profanity / unwanted patterns.
 * Returns specific reasons so the UI can give clear feedback.
 */
export function checkSpamContent(text: string): { isSpam: boolean; reasons: string[] } {
  if (!text || typeof text !== 'string') return { isSpam: false, reasons: [] };

  const reasons: string[] = [];
  const trimmed = text.trim();

  // 1. Profanity check
  const profanityMatches = trimmed.match(PROFANITY_REGEX);
  if (profanityMatches && profanityMatches.length > 0) {
    reasons.push('Contains inappropriate language');
  }

  // 2. URL / link check
  if (URL_REGEX.test(trimmed)) {
    reasons.push('Links and URLs are not allowed in reviews');
  }

  // 3. Phone number check
  if (PHONE_REGEX.test(trimmed)) {
    reasons.push('Phone numbers are not allowed in reviews');
  }

  // 4. Email check
  if (EMAIL_REGEX.test(trimmed)) {
    reasons.push('Email addresses are not allowed in reviews');
  }

  // 5. Excessive caps (> 60% uppercase, min 20 chars to avoid false positives)
  if (trimmed.length >= 20) {
    const letters = trimmed.replace(/[^a-zA-Z]/g, '');
    const upperCount = (letters.match(/[A-Z]/g) || []).length;
    if (letters.length > 0 && upperCount / letters.length > 0.6) {
      reasons.push('Excessive use of capital letters — please use normal casing');
    }
  }

  // 6. Repeated characters (5+ consecutive identical chars)
  if (/(.)\1{4,}/i.test(trimmed)) {
    reasons.push('Contains repeated characters — please write a genuine review');
  }

  // 7. Excessive punctuation (10+ consecutive ! or ?)
  if (/[!?]{10,}/.test(trimmed)) {
    reasons.push('Excessive punctuation — please tone it down');
  }

  return { isSpam: reasons.length > 0, reasons };
}

/**
 * Censor profanity in text (for display in admin panel).
 * Replaces matched words with asterisks while keeping first letter.
 */
export function censorProfanity(text: string): string {
  if (!text) return '';
  return text.replace(PROFANITY_REGEX, (match) => {
    return match[0] + '*'.repeat(match.length - 1);
  });
}
