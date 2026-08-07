export type BlogCategory = 'Counseling' | 'Comparisons' | 'Quotas' | 'Strategy' | 'Colleges';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogTocItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string; // ISO date format YYYY-MM-DD
  updatedAt?: string;
  readTime: string; // e.g. "6 min read"
  author: BlogAuthor;
  tags: string[];
  featuredImage?: string;
  featured?: boolean;
  content: string; // Full Markdown content
}
