import { supabase } from "@/integrations/supabase/client";

export type ForumCategory =
  | "Option Entry"
  | "Cutoff Movements"
  | "College vs Branch"
  | "Campus & Hostels"
  | "Document Verification"
  | "General Lounge";

export interface ForumReply {
  id: string;
  postId: string;
  parentId?: string | null;
  authorName: string;
  authorRank?: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isSolution?: boolean;
  userVoted?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  authorName: string;
  authorRank?: string;
  authorBadge?: "Verified Student" | "KCET Aspirant" | "COMEDK Aspirant" | "Senior Mentor" | "Top Contributor";
  createdAt: string;
  upvotes: number;
  replyCount: number;
  isSolved: boolean;
  pinned?: boolean;
  userVoted?: boolean;
  replies: ForumReply[];
}

const STORAGE_KEY = "kcet_forum_posts_v1";

// 🌟 Seed Posts for offline resilience & immediate display
const INITIAL_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "RVCE ECE vs BMSCE CSE Specialization (AI/ML) – Which is better for placement?",
    content: "My KCET rank is 2,450 (GM). I'm confused between taking Electronics & Communication at RV College of Engineering vs CSE (AI & Machine Learning) at BMS College of Engineering. My end goal is tech placements in software/AI. Seniors please suggest!",
    category: "College vs Branch",
    tags: ["RVCE", "BMSCE", "CSE", "ECE", "Placements"],
    authorName: "Ananya_R",
    authorRank: "Rank #2,450 (GM)",
    authorBadge: "KCET Aspirant",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    upvotes: 42,
    replyCount: 3,
    isSolved: true,
    pinned: true,
    replies: [
      {
        id: "reply-1-1",
        postId: "post-1",
        authorName: "Rahul_S (RVCE Batch '25)",
        authorRank: "Senior Mentor",
        authorBadge: "Senior Mentor",
        content: "If you are strictly aiming for software development roles, BMSCE CSE (AI/ML) gives you direct access to 95%+ of IT recruiters. However, RVCE ECE has tier-1 reputation and almost 85% of tech companies allow ECE students for coding rounds. If you love hardware + coding, pick RVCE ECE!",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        upvotes: 28,
        isSolution: true,
      },
      {
        id: "reply-1-2",
        postId: "post-1",
        parentId: "reply-1-1",
        authorName: "Ananya_R",
        authorRank: "Rank #2,450 (GM)",
        authorBadge: "KCET Aspirant",
        content: "Thank you so much Rahul! Do ECE students find time to practice Data Structures alongside academic labs at RVCE?",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        upvotes: 9,
      },
      {
        id: "reply-1-3",
        postId: "post-1",
        parentId: "reply-1-2",
        authorName: "Rahul_S (RVCE Batch '25)",
        authorRank: "Senior Mentor",
        authorBadge: "Senior Mentor",
        content: "Yes, 3rd semester is heavy but 4th semester onwards you get enough weekends and project time. Build good projects on GitHub!",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        upvotes: 14,
      }
    ]
  },
  {
    id: "post-2",
    title: "Round 2 Extended Cutoff predictions for MSRIT & BMSCE Computer Science?",
    content: "Will MSRIT CSE cutoff drop below 4,500 in Round 2 Extended? In 2024 it dropped by around 800 ranks due to COMEDK seat surrenders. What are the expected shifts for 2026?",
    category: "Cutoff Movements",
    tags: ["Round2", "MSRIT", "CutoffDrift", "KEA"],
    authorName: "Karthik_KCET",
    authorRank: "Rank #4,820 (3BG)",
    authorBadge: "KCET Aspirant",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    upvotes: 29,
    replyCount: 1,
    isSolved: false,
    replies: [
      {
        id: "reply-2-1",
        postId: "post-2",
        authorName: "DataWizard",
        authorRank: "Top Contributor",
        authorBadge: "Top Contributor",
        content: "Based on historical drift analytics on KCET Coded, Round 2 usually sees a 12% to 18% rank expansion for Tier-1 colleges once AICTE supernumerary seats are added. You have a solid ~75% chance in Extended Round!",
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        upvotes: 19,
      }
    ]
  },
  {
    id: "post-3",
    title: "Study Certificate Verification Checklist – Study in Rural Area (1K/1R Category)",
    content: "Hey guys! Quick reminder for 1K (Kannada Medium) and 1R (Rural) claimers: Make sure your BEO signature is stamped in GREEN/BLUE ink on the proforma. KEA helpline confirmed last year's forms are accepted if signed within valid dates.",
    category: "Document Verification",
    tags: ["KEA", "Documents", "StudyCertificate", "BEO"],
    authorName: "Praveen_Kumar",
    authorRank: "Verified Student",
    authorBadge: "Verified Student",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    upvotes: 67,
    replyCount: 2,
    isSolved: true,
    pinned: true,
    replies: [
      {
        id: "reply-3-1",
        postId: "post-3",
        authorName: "Sowmya_B",
        authorRank: "Rank #15,200 (1K)",
        authorBadge: "KCET Aspirant",
        content: "Is counter-signature of DDPI required if I studied in 2 different schools in the same district?",
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        upvotes: 11,
      },
      {
        id: "reply-3-2",
        postId: "post-3",
        parentId: "reply-3-1",
        authorName: "Praveen_Kumar",
        authorRank: "Verified Student",
        authorBadge: "Verified Student",
        content: "Yes, both school certificates must be consolidated and verified by the respective block BEO office.",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        upvotes: 15,
        isSolution: true,
      }
    ]
  },
  {
    id: "post-4",
    title: "Option Entry Strategy: How many options should I enter to avoid losing a seat?",
    content: "Is entering 40-50 options enough, or should I enter 100+ options? My rank is 18,500 and I want top colleges in Bangalore (CSE/ISE/ECE).",
    category: "Option Entry",
    tags: ["OptionEntry", "KCET2026", "Strategy", "Bangalore"],
    authorName: "Vidyadhara",
    authorRank: "Rank #18,500 (GM)",
    authorBadge: "KCET Aspirant",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    upvotes: 35,
    replyCount: 1,
    isSolved: false,
    replies: [
      {
        id: "reply-4-1",
        postId: "post-4",
        authorName: "Coded_Counselor",
        authorRank: "Senior Mentor",
        authorBadge: "Senior Mentor",
        content: "Always add 80+ options! Group them in 3 bands: 20 Dream Colleges (Cutoffs above rank), 40 Realistic Colleges (Cutoffs around your rank), and 20 Safe Backup Colleges (Cutoffs below your rank). Never leave it empty!",
        createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
        upvotes: 31,
      }
    ]
  }
];

export function getStoredPosts(): ForumPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_POSTS;
  } catch {
    return INITIAL_POSTS;
  }
}

export function saveStoredPosts(posts: ForumPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error("Failed to save forum posts:", err);
  }
}

// 🌐 Asynchronously sync with Supabase Cloud DB
export async function syncPostsFromSupabase(): Promise<ForumPost[]> {
  try {
    const { data: dbPosts, error: postErr } = await supabase
      .from("forum_posts" as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (postErr || !dbPosts || dbPosts.length === 0) {
      return getStoredPosts();
    }

    const { data: dbReplies } = await supabase
      .from("forum_replies" as any)
      .select("*")
      .order("created_at", { ascending: true });

    const repliesList = (dbReplies || []) as any[];

    const remotePosts: ForumPost[] = (dbPosts as any[]).map((p) => {
      const postReplies: ForumReply[] = repliesList
        .filter((r) => r.post_id === p.id)
        .map((r) => ({
          id: r.id,
          postId: r.post_id,
          parentId: r.parent_id,
          authorName: r.author_name,
          authorRank: r.author_rank,
          authorBadge: r.author_badge,
          content: r.content,
          createdAt: r.created_at,
          upvotes: r.upvotes || 1,
          isSolution: r.is_solution,
        }));

      return {
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category,
        tags: p.tags || [],
        authorName: p.author_name,
        authorRank: p.author_rank,
        authorBadge: p.author_badge || "Verified Student",
        createdAt: p.created_at,
        upvotes: p.upvotes || 1,
        replyCount: postReplies.length,
        isSolved: p.is_solved || postReplies.some((r) => r.isSolution),
        pinned: p.pinned,
        replies: postReplies,
      };
    });

    // Merge with initial seed posts so default guides are preserved
    const existingLocal = getStoredPosts();
    const remoteIds = new Set(remotePosts.map((p) => p.id));
    const merged = [
      ...remotePosts,
      ...existingLocal.filter((p) => !remoteIds.has(p.id)),
    ];

    saveStoredPosts(merged);
    return merged;
  } catch (err) {
    console.warn("Supabase forum fetch fallback to local:", err);
    return getStoredPosts();
  }
}

export function createForumPost(input: {
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  authorName: string;
  authorRank?: string;
}): ForumPost {
  const posts = getStoredPosts();
  const newPost: ForumPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category,
    tags: input.tags.map((t) => t.trim().replace(/^#/, "")).filter(Boolean),
    authorName: input.authorName.trim() || "Anonymous Student",
    authorRank: input.authorRank?.trim() || undefined,
    authorBadge: input.authorRank ? "KCET Aspirant" : "Verified Student",
    createdAt: new Date().toISOString(),
    upvotes: 1,
    userVoted: true,
    replyCount: 0,
    isSolved: false,
    replies: [],
  };

  const updated = [newPost, ...posts];
  saveStoredPosts(updated);

  // Sync to Supabase
  try {
    void supabase.from("forum_posts" as any).insert({
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags,
      author_name: newPost.authorName,
      author_rank: newPost.authorRank,
      author_badge: newPost.authorBadge,
      created_at: newPost.createdAt,
      upvotes: 1,
      reply_count: 0,
      is_solved: false,
      pinned: false,
    });
  } catch {}

  return newPost;
}

export function toggleUpvotePost(postId: string): ForumPost | null {
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return null;

  const target = posts[index];
  const userVoted = !target.userVoted;
  const newUpvotes = userVoted ? target.upvotes + 1 : Math.max(0, target.upvotes - 1);

  posts[index] = {
    ...target,
    upvotes: newUpvotes,
    userVoted,
  };

  saveStoredPosts(posts);

  // Sync to Supabase
  try {
    void supabase
      .from("forum_posts" as any)
      .update({ upvotes: newUpvotes })
      .eq("id", postId);
  } catch {}

  return posts[index];
}

export function addReplyToPost(input: {
  postId: string;
  parentId?: string | null;
  content: string;
  authorName: string;
  authorRank?: string;
}): ForumReply | null {
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === input.postId);
  if (index === -1) return null;

  const target = posts[index];
  const newReply: ForumReply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    postId: input.postId,
    parentId: input.parentId || null,
    authorName: input.authorName.trim() || "Anonymous Student",
    authorRank: input.authorRank?.trim() || undefined,
    authorBadge: input.authorRank ? "KCET Aspirant" : "Verified Student",
    content: input.content.trim(),
    createdAt: new Date().toISOString(),
    upvotes: 1,
    userVoted: true,
  };

  const updatedReplies = [...target.replies, newReply];
  posts[index] = {
    ...target,
    replies: updatedReplies,
    replyCount: updatedReplies.length,
  };

  saveStoredPosts(posts);

  // Sync to Supabase
  try {
    void supabase.from("forum_replies" as any).insert({
      id: newReply.id,
      post_id: newReply.postId,
      parent_id: newReply.parentId,
      author_name: newReply.authorName,
      author_rank: newReply.authorRank,
      author_badge: newReply.authorBadge,
      content: newReply.content,
      created_at: newReply.createdAt,
      upvotes: 1,
      is_solution: false,
    });

    void supabase
      .from("forum_posts" as any)
      .update({ reply_count: updatedReplies.length })
      .eq("id", input.postId);
  } catch {}

  return newReply;
}

export function toggleUpvoteReply(postId: string, replyId: string): boolean {
  const posts = getStoredPosts();
  const pIdx = posts.findIndex((p) => p.id === postId);
  if (pIdx === -1) return false;

  const post = posts[pIdx];
  const rIdx = post.replies.findIndex((r) => r.id === replyId);
  if (rIdx === -1) return false;

  const targetReply = post.replies[rIdx];
  const userVoted = !targetReply.userVoted;
  const newUpvotes = userVoted ? targetReply.upvotes + 1 : Math.max(0, targetReply.upvotes - 1);

  post.replies[rIdx] = {
    ...targetReply,
    upvotes: newUpvotes,
    userVoted,
  };

  saveStoredPosts(posts);

  try {
    void supabase
      .from("forum_replies" as any)
      .update({ upvotes: newUpvotes })
      .eq("id", replyId);
  } catch {}

  return true;
}

export function markReplyAsSolution(postId: string, replyId: string): boolean {
  const posts = getStoredPosts();
  const pIdx = posts.findIndex((p) => p.id === postId);
  if (pIdx === -1) return false;

  const post = posts[pIdx];
  post.replies = post.replies.map((r) => ({
    ...r,
    isSolution: r.id === replyId ? !r.isSolution : false,
  }));
  post.isSolved = post.replies.some((r) => r.isSolution);

  saveStoredPosts(posts);

  try {
    void supabase
      .from("forum_posts" as any)
      .update({ is_solved: post.isSolved })
      .eq("id", postId);

    void supabase
      .from("forum_replies" as any)
      .update({ is_solution: false })
      .eq("post_id", postId);

    if (post.isSolved) {
      void supabase
        .from("forum_replies" as any)
        .update({ is_solution: true })
        .eq("id", replyId);
    }
  } catch {}

  return true;
}

export function checkIsAdmin(): boolean {
  try {
    return (
      sessionStorage.getItem("kcet_admin_auth") === "true" ||
      localStorage.getItem("kcet_admin_auth") === "true" ||
      localStorage.getItem("kcet_admin_session") === "true"
    );
  } catch {
    return false;
  }
}

export function togglePinPost(postId: string): boolean {
  if (!checkIsAdmin()) return false;
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return false;

  posts[index].pinned = !posts[index].pinned;
  saveStoredPosts(posts);

  try {
    void supabase
      .from("forum_posts" as any)
      .update({ pinned: posts[index].pinned })
      .eq("id", postId);
  } catch {}

  return true;
}

export function deletePost(postId: string): boolean {
  if (!checkIsAdmin()) return false;
  const posts = getStoredPosts();
  const filtered = posts.filter((p) => p.id !== postId);
  saveStoredPosts(filtered);

  try {
    void supabase.from("forum_posts" as any).delete().eq("id", postId);
  } catch {}

  return true;
}

export function deleteReply(postId: string, replyId: string): boolean {
  if (!checkIsAdmin()) return false;
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return false;

  posts[index].replies = posts[index].replies.filter((r) => r.id !== replyId);
  posts[index].replyCount = posts[index].replies.length;
  saveStoredPosts(posts);

  try {
    void supabase.from("forum_replies" as any).delete().eq("id", replyId);
  } catch {}

  return true;
}
