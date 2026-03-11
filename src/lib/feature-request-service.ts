// Service to manage "Feature Requests" and improvements suggested by users

export interface FeatureRequestEntry {
    id: string;
    type: 'feature' | 'improvement' | 'bug' | 'other';
    title: string;
    description: string;
    votes: number;
    status: 'pending' | 'planned' | 'in-progress' | 'completed';
    timestamp: string;
}

const FEATURE_STORAGE_KEY = 'kcet_feature_requests';

export class FeatureRequestService {
    private static requestList: FeatureRequestEntry[] = [];
    private static isLoaded = false;

    static init(): void {
        if (this.isLoaded) return;
        try {
            const raw = localStorage.getItem(FEATURE_STORAGE_KEY);
            if (raw) {
                this.requestList = JSON.parse(raw);
            }
        } catch {
            this.requestList = [];
        }
        this.isLoaded = true;
    }

    private static save(): void {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(this.requestList));
    }

    static addRequest(entry: Omit<FeatureRequestEntry, 'id' | 'timestamp' | 'votes' | 'status'>): void {
        this.init();
        const newEntry: FeatureRequestEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 11),
            votes: 1, // Auto-upvote their own submission
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        this.requestList.unshift(newEntry);
        this.save();
    }

    static getAllRequests(): FeatureRequestEntry[] {
        this.init();
        // Return sorted by votes (descending) then by newest
        return [...this.requestList].sort((a, b) => {
            if (b.votes !== a.votes) return b.votes - a.votes;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }

    static upvoteRequest(id: string): void {
        this.init();
        const req = this.requestList.find(r => r.id === id);
        if (req) {
            req.votes += 1;
            this.save();
        }
    }

    // Admin commands
    static updateStatus(id: string, status: FeatureRequestEntry['status']): void {
        this.init();
        const req = this.requestList.find(r => r.id === id);
        if (req) {
            req.status = status;
            this.save();
        }
    }

    static deleteRequest(id: string): void {
        this.init();
        this.requestList = this.requestList.filter(f => f.id !== id);
        this.save();
    }

    static clearAll(): void {
        this.requestList = [];
        this.save();
    }
}
