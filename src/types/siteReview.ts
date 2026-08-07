export interface SiteReview {
  id: string;
  rating: number; // 1 to 5
  name: string;
  rank?: string; // e.g., "KCET Rank 4,200" or "COMEDK Rank 1,800"
  comment: string;
  usefulTools: string[];
  createdAt: string; // ISO date
  approved?: boolean;
}
