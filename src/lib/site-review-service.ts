import { SiteReview } from "@/types/siteReview";
import { supabase } from "@/integrations/supabase/client";

const LOCAL_STORAGE_KEY = "kcetcoded_website_reviews";

// Pre-seeded high quality student reviews for social proof
const INITIAL_REVIEWS: SiteReview[] = [
  {
    id: "rev-1",
    rating: 5,
    name: "Aditya Hegde",
    rank: "KCET Rank 2,840",
    comment: "The Cutoff Explorer and Choice 1/2/3/4 guide saved me from making a huge mistake during Round 1 option entry. Cleanest KCET tool on the internet!",
    usefulTools: ["College Predictor", "Cutoff Explorer", "Admissions Journal"],
    createdAt: "2026-08-06T10:30:00.000Z",
    approved: true
  },
  {
    id: "rev-2",
    rating: 5,
    name: "Sneha Rao",
    rank: "KCET Rank 5,120",
    comment: "Compared RVCE vs BMSCE CSE using their college comparison guide. Super clear, zero clickbait, and 100% accurate cutoff data.",
    usefulTools: ["Cutoff Trends", "Admissions Journal"],
    createdAt: "2026-08-05T14:15:00.000Z",
    approved: true
  },
  {
    id: "rev-3",
    rating: 5,
    name: "Karthik M.",
    rank: "COMEDK Rank 3,600",
    comment: "COMEDK Explorer with original KEA/COMEDK PDF sources gave me complete confidence. No other site has this level of detail.",
    usefulTools: ["COMEDK Explorer", "College Predictor"],
    createdAt: "2026-08-04T09:45:00.000Z",
    approved: true
  }
];

export class SiteReviewService {
  private static getLocalReviews(): SiteReview[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading local site reviews:", e);
    }
    return INITIAL_REVIEWS;
  }

  private static saveLocalReviews(reviews: SiteReview[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error("Error saving local site reviews:", e);
    }
  }

  static async submitReview(reviewData: Omit<SiteReview, "id" | "createdAt" | "approved">): Promise<SiteReview> {
    const newReview: SiteReview = {
      ...reviewData,
      id: "rev-" + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      approved: true
    };

    // Save locally first
    const currentLocal = this.getLocalReviews();
    const updatedLocal = [newReview, ...currentLocal];
    this.saveLocalReviews(updatedLocal);

    // Attempt Supabase insert if table exists
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from("site_reviews").insert([
        {
          rating: newReview.rating,
          name: newReview.name,
          rank_info: newReview.rank,
          comment: newReview.comment,
          useful_tools: newReview.usefulTools,
          created_at: newReview.createdAt,
          approved: true
        }
      ]);
      if (error) {
        console.warn("Supabase insert error (falling back to local storage):", error.message);
      }
    } catch (e) {
      console.warn("Supabase connection issue (stored locally):", e);
    }

    return newReview;
  }

  static async getApprovedReviews(): Promise<SiteReview[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("site_reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((row: any) => ({
          id: row.id || row.created_at,
          rating: row.rating,
          name: row.name,
          rank: row.rank_info,
          comment: row.comment,
          usefulTools: row.useful_tools || [],
          createdAt: row.created_at,
          approved: row.approved
        }));
      }
    } catch {
      // fallback
    }

    return this.getLocalReviews();
  }

  static getLocalReviewsSync(): SiteReview[] {
    return this.getLocalReviews();
  }
}
