import { CutoffData } from './cutoff-service';

// Admin-specific metadata on each entry
export interface AdminCutoffEntry extends CutoffData {
    _key: string;
    _modified_at?: string;
    _modified_by?: string;
    _deleted?: boolean;
}

export interface AdminOperation {
    type: 'add' | 'update' | 'delete';
    key: string;
    before: AdminCutoffEntry | null;
    after: AdminCutoffEntry | null;
    timestamp: string;
}

const STORAGE_KEY = 'kcet_admin_overlay';
const UNDO_KEY = 'kcet_admin_undo';
const MAX_UNDO = 50;

// Generates a unique key for deduplication
function makeKey(entry: { year: string; round: string; institute_code: string; course: string; category: string }): string {
    return [
        String(entry.year || '').trim(),
        String(entry.round || '').trim().toUpperCase(),
        String(entry.institute_code || '').trim().toUpperCase(),
        String(entry.course || '').trim().toUpperCase(),
        String(entry.category || '').trim().toUpperCase(),
    ].join('|');
}

export class AdminCutoffService {
    private static overlay: Map<string, AdminCutoffEntry> = new Map();
    private static undoStack: AdminOperation[] = [];
    private static baseCutoffs: CutoffData[] = [];
    private static isLoaded = false;

    // ─── Persistence ────────────────────────────────────────────
    private static saveOverlay(): void {
        const obj: Record<string, AdminCutoffEntry> = {};
        for (const [k, v] of this.overlay.entries()) {
            obj[k] = v;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    }

    private static loadOverlay(): void {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed: Record<string, AdminCutoffEntry> = JSON.parse(raw);
                this.overlay = new Map(Object.entries(parsed));
            }
        } catch {
            this.overlay = new Map();
        }
    }

    private static saveUndoStack(): void {
        localStorage.setItem(UNDO_KEY, JSON.stringify(this.undoStack.slice(-MAX_UNDO)));
    }

    private static loadUndoStack(): void {
        try {
            const raw = localStorage.getItem(UNDO_KEY);
            if (raw) {
                this.undoStack = JSON.parse(raw);
            }
        } catch {
            this.undoStack = [];
        }
    }

    private static pushUndo(op: AdminOperation): void {
        this.undoStack.push(op);
        if (this.undoStack.length > MAX_UNDO) {
            this.undoStack = this.undoStack.slice(-MAX_UNDO);
        }
        this.saveUndoStack();
    }

    // ─── Initialization ─────────────────────────────────────────
    static async init(): Promise<void> {
        if (this.isLoaded) return;

        // Load base data from the same sources CutoffExplorer uses
        const urls = [
            '/data/kcet_cutoffs_high_volume.json',
            '/data/kcet_cutoffs_master.json',
            '/data/kcet_cutoffs_consolidated.json',
            '/kcet_cutoffs.json',
        ];

        for (const url of urls) {
            try {
                const res = await fetch(url, { cache: 'no-store' });
                if (res.ok) {
                    const raw = await res.json();
                    const arr = Array.isArray(raw) ? raw : (raw.cutoffs ?? raw.data ?? []);
                    this.baseCutoffs = arr.map((item: any) => ({
                        year: String(item.year || '').trim(),
                        round: String(item.round || '').trim(),
                        institute_code: String(item.institute_code || '').trim(),
                        institute: String(item.institute || item.college_name || '').trim(),
                        course: String(item.course || '').trim(),
                        category: String(item.category || '').trim(),
                        cutoff_rank: parseInt(item.cutoff_rank) || 0,
                        college_name: String(item.college_name || item.institute || '').trim(),
                        branch_name: String(item.branch_name || '').trim(),
                        total_seats: parseInt(item.total_seats) || 0,
                        available_seats: parseInt(item.available_seats) || 0,
                    }));
                    break;
                }
            } catch { /* try next */ }
        }

        this.loadOverlay();
        this.loadUndoStack();
        this.isLoaded = true;
    }

    // ─── Getters ────────────────────────────────────────────────
    static getBaseCount(): number {
        return this.baseCutoffs.length;
    }

    static getOverlayCount(): number {
        return [...this.overlay.values()].filter(e => !e._deleted).length;
    }

    static getDeletedCount(): number {
        return [...this.overlay.values()].filter(e => e._deleted).length;
    }

    static getModifiedCount(): number {
        return this.overlay.size;
    }

    static getUndoCount(): number {
        return this.undoStack.length;
    }

    // Get unique values from merged data for autocomplete
    static getUniqueYears(): string[] {
        const merged = this.getMergedData();
        return [...new Set(merged.map(e => e.year))].sort((a, b) => b.localeCompare(a));
    }

    static getUniqueRounds(): string[] {
        const merged = this.getMergedData();
        return [...new Set(merged.map(e => e.round))].sort();
    }

    static getUniqueInstitutes(): { code: string; name: string }[] {
        const merged = this.getMergedData();
        const map = new Map<string, Map<string, number>>();
        for (const e of merged) {
            const code = e.institute_code?.toUpperCase();
            if (!code) continue;
            if (!map.has(code)) map.set(code, new Map());
            const name = (e as any).institute || (e as any).college_name || '';
            if (name) {
                const counts = map.get(code)!;
                counts.set(name, (counts.get(name) || 0) + 1);
            }
        }
        return [...map.entries()]
            .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
            .map(([code, counts]) => {
                let bestName = code;
                let bestCount = -1;
                for (const [name, count] of counts) {
                    if (count > bestCount) { bestName = name; bestCount = count; }
                }
                return { code, name: bestName };
            });
    }

    static getUniqueCategories(): string[] {
        const merged = this.getMergedData();
        return [...new Set(merged.map(e => e.category))].filter(Boolean).sort();
    }

    static getUniqueCourses(): string[] {
        const merged = this.getMergedData();
        return [...new Set(merged.map(e => e.course))].filter(Boolean).sort();
    }

    // ─── Merged Data ────────────────────────────────────────────
    static getMergedData(): AdminCutoffEntry[] {
        const result = new Map<string, AdminCutoffEntry>();

        // Base layer
        for (const entry of this.baseCutoffs) {
            const key = makeKey(entry);
            result.set(key, { ...entry, _key: key } as AdminCutoffEntry);
        }

        // Overlay layer (wins over base)
        for (const [key, entry] of this.overlay.entries()) {
            if (entry._deleted) {
                result.delete(key);
            } else {
                result.set(key, entry);
            }
        }

        return [...result.values()];
    }

    // Get only admin-modified entries
    static getAdminEntries(): AdminCutoffEntry[] {
        return [...this.overlay.values()].filter(e => !e._deleted);
    }

    // Get deleted entries (for reference)
    static getDeletedEntries(): AdminCutoffEntry[] {
        return [...this.overlay.values()].filter(e => e._deleted);
    }

    // ─── CRUD ───────────────────────────────────────────────────
    static addEntry(entry: Omit<CutoffData, 'college_name' | 'branch_name' | 'total_seats' | 'available_seats'> & Partial<CutoffData>): { success: boolean; duplicate: boolean; key: string } {
        const key = makeKey(entry);
        const existing = this.overlay.get(key) || (this.baseCutoffs.find(e => makeKey(e) === key) ? { ...this.baseCutoffs.find(e => makeKey(e) === key)!, _key: key } as AdminCutoffEntry : null);

        const newEntry: AdminCutoffEntry = {
            ...entry,
            _key: key,
            _modified_at: new Date().toISOString(),
            _modified_by: 'admin',
        };

        const isDuplicate = !!existing && !existing._deleted;

        this.pushUndo({
            type: isDuplicate ? 'update' : 'add',
            key,
            before: isDuplicate ? { ...existing! } : null,
            after: { ...newEntry },
            timestamp: new Date().toISOString(),
        });

        this.overlay.set(key, newEntry);
        this.saveOverlay();

        return { success: true, duplicate: isDuplicate, key };
    }

    static updateEntry(key: string, updates: Partial<CutoffData>): boolean {
        const merged = this.getMergedData();
        const existing = merged.find(e => e._key === key);
        if (!existing) return false;

        // If any key fields changed, we need to re-key
        const updatedEntry: AdminCutoffEntry = {
            ...existing,
            ...updates,
            _key: key,
            _modified_at: new Date().toISOString(),
            _modified_by: 'admin',
        };

        const newKey = makeKey(updatedEntry);

        this.pushUndo({
            type: 'update',
            key,
            before: { ...existing },
            after: { ...updatedEntry, _key: newKey },
            timestamp: new Date().toISOString(),
        });

        // If key changed, remove old and add new
        if (newKey !== key) {
            this.overlay.set(key, { ...existing, _deleted: true, _modified_at: new Date().toISOString() });
            updatedEntry._key = newKey;
        }

        this.overlay.set(newKey, updatedEntry);
        this.saveOverlay();
        return true;
    }

    static deleteEntry(key: string): boolean {
        const merged = this.getMergedData();
        const existing = merged.find(e => e._key === key);
        if (!existing) return false;

        this.pushUndo({
            type: 'delete',
            key,
            before: { ...existing },
            after: null,
            timestamp: new Date().toISOString(),
        });

        this.overlay.set(key, { ...existing, _deleted: true, _modified_at: new Date().toISOString(), _modified_by: 'admin' });
        this.saveOverlay();
        return true;
    }

    static bulkDelete(keys: string[]): number {
        let count = 0;
        for (const key of keys) {
            if (this.deleteEntry(key)) count++;
        }
        return count;
    }

    // ─── Undo ──────────────────────────────────────────────────
    static undo(): AdminOperation | null {
        const op = this.undoStack.pop();
        if (!op) return null;

        if (op.type === 'add') {
            this.overlay.delete(op.key);
        } else if (op.type === 'update') {
            if (op.before) {
                this.overlay.set(op.key, op.before);
            } else {
                this.overlay.delete(op.key);
            }
            // If key changed, also clean up the new key
            if (op.after && op.after._key !== op.key) {
                this.overlay.delete(op.after._key);
            }
        } else if (op.type === 'delete' && op.before) {
            if (op.before._modified_by === 'admin') {
                this.overlay.set(op.key, { ...op.before, _deleted: undefined });
            } else {
                this.overlay.delete(op.key);
            }
        }

        this.saveOverlay();
        this.saveUndoStack();
        return op;
    }

    // ─── Reset ──────────────────────────────────────────────────
    static resetAllChanges(): void {
        this.overlay.clear();
        this.undoStack = [];
        this.saveOverlay();
        this.saveUndoStack();
    }

    // ─── Export ─────────────────────────────────────────────────
    static exportAsJSON(): string {
        const merged = this.getMergedData();
        const exportData = {
            metadata: {
                last_updated: new Date().toISOString(),
                total_entries: merged.length,
                admin_modified: this.getOverlayCount(),
                exported_by: 'admin',
            },
            cutoffs: merged.map(e => ({
                year: e.year,
                round: e.round,
                institute_code: e.institute_code,
                institute: (e as any).institute || e.college_name || '',
                course: e.course,
                category: e.category,
                cutoff_rank: e.cutoff_rank,
                college_name: e.college_name || '',
                branch_name: e.branch_name || '',
                total_seats: e.total_seats || 0,
                available_seats: e.available_seats || 0,
            })),
        };
        return JSON.stringify(exportData, null, 2);
    }

    static exportAsCSV(data?: AdminCutoffEntry[]): string {
        const entries = data || this.getMergedData();
        const headers = ['year', 'round', 'institute_code', 'institute', 'course', 'category', 'cutoff_rank', 'college_name', 'branch_name', 'total_seats', 'available_seats'];
        const csvRows = [headers.join(',')];
        for (const e of entries) {
            const row = [
                e.year,
                e.round,
                e.institute_code,
                `"${((e as any).institute || e.college_name || '').replace(/"/g, '""')}"`,
                e.course,
                e.category,
                e.cutoff_rank,
                `"${(e.college_name || '').replace(/"/g, '""')}"`,
                `"${(e.branch_name || '').replace(/"/g, '""')}"`,
                e.total_seats || 0,
                e.available_seats || 0,
            ];
            csvRows.push(row.join(','));
        }
        return csvRows.join('\n');
    }

    static exportChangesOnly(): string {
        const changes = [...this.overlay.values()];
        return JSON.stringify({
            metadata: {
                exported_at: new Date().toISOString(),
                total_changes: changes.length,
            },
            changes,
        }, null, 2);
    }

    // ─── Import ─────────────────────────────────────────────────
    static importFromCSV(csvText: string): { imported: number; errors: string[] } {
        const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return { imported: 0, errors: ['No data rows found'] };

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const errors: string[] = [];
        let imported = 0;

        for (let i = 1; i < lines.length; i++) {
            try {
                // Handle quoted CSV fields
                const values: string[] = [];
                let current = '';
                let inQuotes = false;
                for (const char of lines[i]) {
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        values.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                values.push(current.trim());

                const row: Record<string, string> = {};
                headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

                const entry: any = {
                    year: row.year || '',
                    round: row.round || '',
                    institute_code: row.institute_code || row.institutecode || '',
                    institute: row.institute || row.college_name || row.collegename || '',
                    course: row.course || row.branch_code || '',
                    category: row.category || '',
                    cutoff_rank: parseInt(row.cutoff_rank || row.cutoffrank || '0') || 0,
                    college_name: row.college_name || row.collegename || row.institute || '',
                    branch_name: row.branch_name || row.branchname || '',
                };

                if (!entry.year || !entry.institute_code || !entry.course || !entry.category) {
                    errors.push(`Row ${i + 1}: Missing required fields`);
                    continue;
                }

                this.addEntry(entry);
                imported++;
            } catch (err: any) {
                errors.push(`Row ${i + 1}: ${err.message}`);
            }
        }

        return { imported, errors };
    }

    // ─── Utility ────────────────────────────────────────────────
    static checkDuplicate(entry: { year: string; round: string; institute_code: string; course: string; category: string }): AdminCutoffEntry | null {
        const key = makeKey(entry);
        const merged = this.getMergedData();
        return merged.find(e => e._key === key) || null;
    }

    static downloadFile(content: string, filename: string, type: string = 'application/json'): void {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
