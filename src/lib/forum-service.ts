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
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
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
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorRank?: string;
  authorBadge?: "Verified Student" | "KCET Aspirant" | "COMEDK Aspirant" | "Senior Mentor" | "Top Contributor" | "Pro Member";
  createdAt: string;
  upvotes: number;
  replyCount: number;
  isSolved: boolean;
  pinned?: boolean;
  userVoted?: boolean;
  replies: ForumReply[];
}

const STORAGE_KEY = "kcet_forum_posts_v2";
const CONFIG_KEY = "CONFIG:forum_posts_cloud";
const REALTIME_CHANNEL = "kcet-forum-realtime";

// Initial seed posts
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

let memoryCachePosts: ForumPost[] | null = null;

export function getStoredPosts(): ForumPost[] {
  if (memoryCachePosts && memoryCachePosts.length > 0) {
    return memoryCachePosts;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
      memoryCachePosts = INITIAL_POSTS;
      return INITIAL_POSTS;
    }
    const parsed = JSON.parse(raw);
    const valid = Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_POSTS;
    memoryCachePosts = valid;
    return valid;
  } catch {
    memoryCachePosts = INITIAL_POSTS;
    return INITIAL_POSTS;
  }
}

export function saveStoredPosts(posts: ForumPost[]): void {
  try {
    memoryCachePosts = posts;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error("Failed to save forum posts:", err);
  }
}

/**
 * Broadcast realtime event to all connected forum tabs
 */
async function broadcastForumUpdate(eventType: string, payload?: any) {
  try {
    const channel = supabase.channel(REALTIME_CHANNEL);
    await channel.send({
      type: "broadcast",
      event: "forum_updated",
      payload: { eventType, timestamp: Date.now(), ...payload }
    });
  } catch (e) {
    console.warn("Realtime forum broadcast notice:", e);
  }
}

/**
 * Synchronize full forum state from Supabase Cloud DB
 */
export async function syncPostsFromSupabase(): Promise<ForumPost[]> {
  try {
    const { data, error } = await supabase
      .from("ugcet_results_cache" as any)
      .select("results_json")
      .eq("appl_no", CONFIG_KEY)
      .maybeSingle();

    if (!error && data?.results_json && Array.isArray((data as any).results_json?.posts)) {
      const cloudPosts = (data as any).results_json.posts as ForumPost[];
      if (cloudPosts.length > 0) {
        saveStoredPosts(cloudPosts);
        return cloudPosts;
      }
    }

    // If first time or empty, seed the cloud DB
    const current = getStoredPosts();
    await savePostsToSupabase(current);
    return current;
  } catch (err) {
    console.warn("Supabase forum fetch fallback to local:", err);
    return getStoredPosts();
  }
}

/**
 * Persist full forum state to Supabase Cloud DB
 */
export async function savePostsToSupabase(posts: ForumPost[]): Promise<boolean> {
  saveStoredPosts(posts);
  try {
    const { error } = await supabase
      .from("ugcet_results_cache" as any)
      .upsert(
        [
          {
            appl_no: CONFIG_KEY,
            dob: "forum_db",
            name: "forum_db",
            results_json: { posts, updatedAt: new Date().toISOString() }
          }
        ],
        { onConflict: "appl_no" }
      );

    if (error) throw error;
    await broadcastForumUpdate("posts_saved");
    return true;
  } catch (e) {
    console.error("Error persisting forum posts to Supabase:", e);
    return false;
  }
}

/**
 * Create a new forum question/thread
 */
export async function createForumPost(input: {
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorRank?: string;
  authorBadge?: ForumPost["authorBadge"];
}): Promise<ForumPost> {
  const posts = getStoredPosts();
  const newPost: ForumPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category,
    tags: input.tags.map((t) => t.trim().replace(/^#/, "")).filter(Boolean),
    authorId: input.authorId,
    authorName: input.authorName.trim() || "KCET Aspirant",
    authorEmail: input.authorEmail,
    authorAvatar: input.authorAvatar,
    authorRank: input.authorRank?.trim() || undefined,
    authorBadge: input.authorBadge || (input.authorRank ? "KCET Aspirant" : "Verified Student"),
    createdAt: new Date().toISOString(),
    upvotes: 1,
    userVoted: true,
    replyCount: 0,
    isSolved: false,
    replies: [],
  };

  const updated = [newPost, ...posts];
  await savePostsToSupabase(updated);
  return newPost;
}

/**
 * Toggle upvote for a thread
 */
export async function toggleUpvotePost(postId: string): Promise<ForumPost | null> {
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

  await savePostsToSupabase(posts);
  return posts[index];
}

/**
 * Add a reply/answer to a post
 */
export async function addReplyToPost(input: {
  postId: string;
  parentId?: string | null;
  content: string;
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorRank?: string;
  authorBadge?: string;
}): Promise<ForumReply | null> {
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === input.postId);
  if (index === -1) return null;

  const target = posts[index];
  const newReply: ForumReply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    postId: input.postId,
    parentId: input.parentId || null,
    authorId: input.authorId,
    authorName: input.authorName.trim() || "KCET Aspirant",
    authorEmail: input.authorEmail,
    authorAvatar: input.authorAvatar,
    authorRank: input.authorRank?.trim() || undefined,
    authorBadge: input.authorBadge || (input.authorRank ? "KCET Aspirant" : "Verified Student"),
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

  await savePostsToSupabase(posts);
  return newReply;
}

/**
 * Toggle upvote on a reply
 */
export async function toggleUpvoteReply(postId: string, replyId: string): Promise<boolean> {
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

  await savePostsToSupabase(posts);
  return true;
}

/**
 * Mark a reply as the verified solution
 */
export async function markReplyAsSolution(postId: string, replyId: string): Promise<boolean> {
  const posts = getStoredPosts();
  const pIdx = posts.findIndex((p) => p.id === postId);
  if (pIdx === -1) return false;

  const post = posts[pIdx];
  post.replies = post.replies.map((r) => ({
    ...r,
    isSolution: r.id === replyId ? !r.isSolution : false,
  }));
  post.isSolved = post.replies.some((r) => r.isSolution);

  await savePostsToSupabase(posts);
  return true;
}

/**
 * Check admin privileges
 */
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

/**
 * Pin or unpin a thread
 */
export async function togglePinPost(postId: string): Promise<boolean> {
  if (!checkIsAdmin()) return false;
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return false;

  posts[index].pinned = !posts[index].pinned;
  await savePostsToSupabase(posts);
  return true;
}

/**
 * Delete a thread
 */
export async function deletePost(postId: string): Promise<boolean> {
  if (!checkIsAdmin()) return false;
  const posts = getStoredPosts();
  const filtered = posts.filter((p) => p.id !== postId);
  await savePostsToSupabase(filtered);
  return true;
}

/**
 * Delete a reply
 */
export async function deleteReply(postId: string, replyId: string): Promise<boolean> {
  if (!checkIsAdmin()) return false;
  const posts = getStoredPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return false;

  posts[index].replies = posts[index].replies.filter((r) => r.id !== replyId);
  posts[index].replyCount = posts[index].replies.length;
  await savePostsToSupabase(posts);
  return true;
}

/**
 * Real-time listener across all browser tabs
 */
export function subscribeToForumUpdates(onUpdate: () => void): () => void {
  const channel = supabase.channel(REALTIME_CHANNEL);

  channel
    .on("broadcast", { event: "forum_updated" }, () => {
      syncPostsFromSupabase().then(() => {
        onUpdate();
      });
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}
