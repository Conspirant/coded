// Service to store and retrieve user rank feedback for 2025 aspirants

export interface RankFeedbackEntry {
    id: string;
    actual_rank: number;
    kcet_marks: number;
    puc_marks: number;
    timestamp: string;
}

const FEEDBACK_STORAGE_KEY = 'kcet_2025_feedback';

export class AdminFeedbackService {
    private static feedbackList: RankFeedbackEntry[] = [];
    private static isLoaded = false;

    static init(): void {
        if (this.isLoaded) return;
        try {
            const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
            if (raw) {
                this.feedbackList = JSON.parse(raw);
            }
        } catch {
            this.feedbackList = [];
        }
        this.isLoaded = true;
    }

    private static save(): void {
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(this.feedbackList));
    }

    static addFeedback(feedback: Omit<RankFeedbackEntry, 'id' | 'timestamp'>): void {
        this.init();
        const entry: RankFeedbackEntry = {
            ...feedback,
            id: Math.random().toString(36).substring(2, 11),
            timestamp: new Date().toISOString()
        };
        this.feedbackList.unshift(entry); // Add to top
        this.save();
    }

    static getAllFeedback(): RankFeedbackEntry[] {
        this.init();
        return [...this.feedbackList];
    }

    static deleteFeedback(id: string): void {
        this.init();
        this.feedbackList = this.feedbackList.filter(f => f.id !== id);
        this.save();
    }
    
    static clearAll(): void {
        this.feedbackList = [];
        this.save();
    }
}
