import { supabase } from "@/integrations/supabase/client";
import { Poll, PollOption, VoteRecord } from "@/types/poll";

const CONFIG_KEY = "CONFIG:community_polls";
const LOCAL_VOTES_PREFIX = "kcet_voted_poll_";
const LOCAL_DISMISS_PREFIX = "kcet_dismiss_poll_";
const LOCAL_BACKUP_KEY = "kcetcoded_polls_backup";

let memoryCache: Poll[] | null = null;

function sanitizePolls(rawList: any[]): Poll[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(item => {
    const options: PollOption[] = Array.isArray(item.options)
      ? item.options.map((opt: any, idx: number) => ({
          id: String(opt.id || `opt_${idx}`),
          text: String(opt.text || `Option ${idx + 1}`),
          voteCount: typeof opt.voteCount === 'number' ? opt.voteCount : 0
        }))
      : [];

    const voteHistory: VoteRecord[] = Array.isArray(item.voteHistory)
      ? item.voteHistory.map((v: any, idx: number) => ({
          id: String(v.id || `v_${idx}`),
          pollId: String(v.pollId || item.id),
          optionId: String(v.optionId || ''),
          votedAt: String(v.votedAt || new Date().toISOString()),
          examMode: v.examMode || 'all'
        }))
      : [];

    const totalVotes = options.reduce((sum, o) => sum + o.voteCount, 0);

    return {
      id: String(item.id || `poll_${Math.random().toString(36).substring(2, 9)}`),
      question: String(item.question || "Untitled Poll"),
      options,
      status: item.status === "closed" ? "closed" : "active",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      examMode: item.examMode === "kcet" || item.examMode === "comedk" ? item.examMode : "all",
      displayType: item.displayType === "popup" || item.displayType === "widget" ? item.displayType : "both",
      totalVotes,
      voteHistory
    };
  });
}

export class PollService {
  /**
   * Get all polls (active & closed)
   */
  static async getAllPolls(): Promise<Poll[]> {
    try {
      const { data, error } = await supabase
        .from("ugcet_results_cache" as any)
        .select("results_json")
        .eq("appl_no", CONFIG_KEY)
        .maybeSingle();

      if (error) throw error;

      if (data && (data as any).results_json?.polls) {
        const parsed = sanitizePolls((data as any).results_json.polls);
        memoryCache = parsed;
        try {
          localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(parsed));
        } catch {}
        return parsed;
      }

      return [];
    } catch (e) {
      console.warn("⚠️ PollService: Failed fetching from Supabase, returning local fallback:", e);
      if (memoryCache) return memoryCache;
      try {
        const stored = localStorage.getItem(LOCAL_BACKUP_KEY);
        if (stored) return sanitizePolls(JSON.parse(stored));
      } catch {}
      return [];
    }
  }

  /**
   * Get current active poll (matching exam mode or 'all')
   */
  static async getActivePoll(currentMode?: 'kcet' | 'comedk'): Promise<Poll | null> {
    const polls = await this.getAllPolls();
    const activePolls = polls.filter(p => p.status === 'active');
    
    if (activePolls.length === 0) return null;

    if (currentMode) {
      const modeMatch = activePolls.find(p => p.examMode === currentMode || p.examMode === 'all');
      if (modeMatch) return modeMatch;
    }

    return activePolls[0];
  }

  /**
   * Save entire list of polls
   */
  static async saveAllPolls(polls: Poll[]): Promise<boolean> {
    try {
      memoryCache = polls;
      try {
        localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(polls));
      } catch {}

      const { error } = await supabase
        .from("ugcet_results_cache" as any)
        .upsert(
          [
            {
              appl_no: CONFIG_KEY,
              dob: "config",
              name: "config",
              results_json: { polls, updatedAt: new Date().toISOString() }
            }
          ],
          { onConflict: "appl_no" }
        );

      if (error) throw error;
      return true;
    } catch (e) {
      console.error("⚠️ PollService: Save failed:", e);
      return false;
    }
  }

  /**
   * Create a new poll
   */
  static async createPoll(
    question: string,
    optionsText: string[],
    examMode: 'all' | 'kcet' | 'comedk' = 'all',
    setAsActive: boolean = true,
    displayType: 'widget' | 'popup' | 'both' = 'both'
  ): Promise<Poll | null> {
    const existing = await this.getAllPolls();
    
    const newPoll: Poll = {
      id: `poll_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      question: question.trim(),
      options: optionsText.map((text, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        text: text.trim(),
        voteCount: 0
      })),
      status: setAsActive ? 'active' : 'closed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      examMode,
      displayType,
      totalVotes: 0,
      voteHistory: []
    };

    let updatedList = existing.map(p => {
      if (setAsActive && (p.examMode === examMode || examMode === 'all')) {
        return { ...p, status: 'closed' as const };
      }
      return p;
    });

    updatedList.unshift(newPoll);

    const success = await this.saveAllPolls(updatedList);
    return success ? newPoll : null;
  }

  /**
   * Vote in a poll
   */
  static async castVote(
    pollId: string,
    optionId: string,
    examMode?: 'kcet' | 'comedk' | 'all'
  ): Promise<{ success: boolean; updatedPoll?: Poll; error?: string }> {
    if (this.hasUserVoted(pollId)) {
      return { success: false, error: "You have already voted in this poll." };
    }

    const polls = await this.getAllPolls();
    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) {
      return { success: false, error: "Poll not found." };
    }

    const poll = polls[pollIndex];
    if (poll.status !== 'active') {
      return { success: false, error: "This poll is closed." };
    }

    const optIndex = poll.options.findIndex(o => o.id === optionId);
    if (optIndex === -1) {
      return { success: false, error: "Invalid option selected." };
    }

    // Increment count
    poll.options[optIndex].voteCount += 1;
    poll.totalVotes = poll.options.reduce((sum, o) => sum + o.voteCount, 0);
    poll.updatedAt = new Date().toISOString();

    const newVoteRecord: VoteRecord = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      pollId,
      optionId,
      votedAt: new Date().toISOString(),
      examMode: examMode || 'all'
    };

    if (!poll.voteHistory) poll.voteHistory = [];
    poll.voteHistory.push(newVoteRecord);

    polls[pollIndex] = poll;

    const saved = await this.saveAllPolls(polls);
    if (saved) {
      try {
        localStorage.setItem(`${LOCAL_VOTES_PREFIX}${pollId}`, optionId);
      } catch {}
      return { success: true, updatedPoll: poll };
    } else {
      return { success: false, error: "Failed to record vote. Please try again." };
    }
  }

  /**
   * Check if user has already voted in a poll
   */
  static hasUserVoted(pollId: string): boolean {
    try {
      return Boolean(localStorage.getItem(`${LOCAL_VOTES_PREFIX}${pollId}`));
    } catch {
      return false;
    }
  }

  /**
   * Dismiss poll popup for current visitor session
   */
  static dismissPollPopup(pollId: string): void {
    try {
      sessionStorage.setItem(`${LOCAL_DISMISS_PREFIX}${pollId}`, "1");
    } catch {}
  }

  /**
   * Check if visitor has dismissed poll popup in current session
   */
  static isPollDismissed(pollId: string): boolean {
    try {
      return Boolean(sessionStorage.getItem(`${LOCAL_DISMISS_PREFIX}${pollId}`));
    } catch {
      return false;
    }
  }

  /**
   * Clear dismissal tokens for testing/resetting
   */
  static clearPollDismissal(pollId: string): void {
    try {
      sessionStorage.removeItem(`${LOCAL_DISMISS_PREFIX}${pollId}`);
      localStorage.removeItem(`${LOCAL_DISMISS_PREFIX}${pollId}`);
    } catch {}
  }

  /**
   * Get user's selected option ID for a poll if voted
   */
  static getUserVotedOption(pollId: string): string | null {
    try {
      return localStorage.getItem(`${LOCAL_VOTES_PREFIX}${pollId}`);
    } catch {
      return null;
    }
  }

  /**
   * Toggle poll status (active / closed)
   */
  static async togglePollStatus(pollId: string, status: 'active' | 'closed'): Promise<boolean> {
    const polls = await this.getAllPolls();
    const updated = polls.map(p => p.id === pollId ? { ...p, status, updatedAt: new Date().toISOString() } : p);
    return await this.saveAllPolls(updated);
  }

  /**
   * Delete poll
   */
  static async deletePoll(pollId: string): Promise<boolean> {
    const polls = await this.getAllPolls();
    const updated = polls.filter(p => p.id !== pollId);
    return await this.saveAllPolls(updated);
  }
}
