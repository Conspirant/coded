import { useState, useEffect } from "react";

export type ActivityCategory = 'challenge' | 'explorer' | 'predictor' | 'college' | 'news' | 'simulator';

export interface DailyTask {
  id: string;
  label: string;
  category: ActivityCategory;
  completed: boolean;
  actionUrl: string;
}

export interface EngagementState {
  streak: number;
  lastActiveDate: string;
  tasksDate: string;
  todayTasks: DailyTask[];
  totalActions: number;
}

const STORAGE_KEY = "kcet_daily_engagement_v1";

const TASK_POOL: Array<Omit<DailyTask, 'completed'>> = [
  { id: 't_chall', label: "Complete today's Daily Challenge", category: 'challenge', actionUrl: '/daily-challenge' },
  { id: 't_expl', label: "Analyze closing ranks in Cutoff Explorer", category: 'explorer', actionUrl: '/cutoff-explorer' },
  { id: 't_pred', label: "Check standing in Rank Predictor", category: 'predictor', actionUrl: '/rank-predictor' },
  { id: 't_coll', label: "Explore a college directory or detail page", category: 'college', actionUrl: '/colleges' },
  { id: 't_sim', label: "Simulate preference list in Mock Simulator", category: 'simulator', actionUrl: '/mock-simulator' },
  { id: 't_news', label: "Stay informed with latest CET News", category: 'news', actionUrl: '/cet-news' },
];

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function generateDailyTasks(dateStr: string): DailyTask[] {
  // Deterministic daily selection based on date string so tasks rotate smoothly
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  
  const pool = [...TASK_POOL];
  const selected: DailyTask[] = [];
  
  // Always pick 3 tasks for daily routine
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = (hash + i * 17) % pool.length;
    const task = pool.splice(idx, 1)[0];
    selected.push({ ...task, completed: false });
  }
  
  return selected;
}

function getDefaultState(): EngagementState {
  const today = getTodayStr();
  return {
    streak: 1,
    lastActiveDate: today,
    tasksDate: today,
    todayTasks: generateDailyTasks(today),
    totalActions: 0,
  };
}

export function getEngagementState(): EngagementState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const state = raw ? (JSON.parse(raw) as EngagementState) : getDefaultState();
    const today = getTodayStr();

    // Check if tasks need daily rollover
    if (state.tasksDate !== today) {
      const yesterday = getYesterdayStr();
      if (state.lastActiveDate === yesterday || state.lastActiveDate === today) {
        if (state.lastActiveDate !== today) {
          state.streak += 1;
        }
      } else {
        // Reset streak if missed more than 1 day
        state.streak = 1;
      }

      state.tasksDate = today;
      state.lastActiveDate = today;
      state.todayTasks = generateDailyTasks(today);
      saveEngagementState(state);
    } else if (state.lastActiveDate !== today) {
      state.lastActiveDate = today;
      saveEngagementState(state);
    }

    return state;
  } catch (error) {
    return getDefaultState();
  }
}

function saveEngagementState(state: EngagementState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifySubscribers(state);
  } catch (error) {
    // Silently ignore Quota / syntax issues
  }
}

// Simple Pub/Sub for React reactive UI updates
type Subscriber = (state: EngagementState) => void;
const subscribers = new Set<Subscriber>();

function notifySubscribers(state: EngagementState) {
  subscribers.forEach((fn) => fn(state));
}

export function subscribeToEngagement(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/**
 * Log user activity in a specific category to complete daily tasks and build engagement history.
 */
export function logActivity(category: ActivityCategory) {
  const state = getEngagementState();
  let stateChanged = false;

  // Check if this action completes any daily task
  const updatedTasks = state.todayTasks.map((task) => {
    if (task.category === category && !task.completed) {
      stateChanged = true;
      return { ...task, completed: true };
    }
    return task;
  });

  if (stateChanged || state.totalActions >= 0) {
    state.todayTasks = updatedTasks;
    state.totalActions += 1;
    saveEngagementState(state);
  }
}

/**
 * Custom React hook to get real-time daily engagement state.
 */
export function useEngagement(): EngagementState {
  const [state, setState] = useState<EngagementState>(getEngagementState);

  useEffect(() => {
    return subscribeToEngagement((newState) => {
      setState({ ...newState });
    });
  }, []);

  return state;
}
