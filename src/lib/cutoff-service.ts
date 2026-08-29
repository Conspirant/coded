import { supabase } from "@/integrations/supabase/client";
import { DataVault } from "./data-vault";

export interface CutoffData {
  year: string;
  round: string;
  institute_code: string;
  course: string;
  category: string;
  cutoff_rank: number;
  college_name?: string;
  branch_name?: string;
  total_seats?: number;
  available_seats?: number;
}

export interface MockAllotmentResult {
  collegeCode: string;
  branchCode: string;
  collegeName: string;
  branchName: string;
  cutoff_rank: number;
  year: string;
  round: string;
  category: string;
  success: boolean;
  message: string;
}

export interface CutoffQueryFilter {
  institute_code?: string;
  course?: string;
  category?: string;
  year?: string;
  round?: string;
  max_rank?: number;
  limit?: number;
}

export class CutoffService {
  private static cutoffs: CutoffData[] = [];
  private static isLoaded = false;
  private static loadPromise: Promise<CutoffData[]> | null = null;

  /**
   * Query cutoffs using Supabase Backend API with automatic client fallback.
   */
  static async queryCutoffs(filter: CutoffQueryFilter = {}): Promise<CutoffData[]> {
    try {
      // 1. Try querying Supabase backend
      let q = (supabase as any).from('cutoffs').select(`
        year,
        round,
        category,
        closing_rank,
        opening_rank,
        colleges!inner (code, name),
        branches!inner (code, name)
      `);

      if (filter.year) q = q.eq('year', parseInt(filter.year) || filter.year);
      if (filter.category) q = q.eq('category', filter.category);
      if (filter.max_rank) q = q.lte('closing_rank', filter.max_rank);
      if (filter.limit) q = q.limit(filter.limit);

      const { data, error } = await q;

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          year: String(row.year || '2025'),
          round: String(row.round || 'R1'),
          institute_code: row.colleges?.code || '',
          college_name: row.colleges?.name || '',
          course: row.branches?.name || row.branches?.code || '',
          branch_name: row.branches?.name || '',
          category: String(row.category || 'GM'),
          cutoff_rank: Number(row.closing_rank) || 0
        }));
      }
    } catch {
      // Supabase table empty or network error -> proceed to local dataset fallback
    }

    // 2. Fallback to in-memory loaded dataset
    const all = await this.loadCutoffs();
    return all.filter((c) => {
      if (filter.institute_code && this.normalizeCode(c.institute_code) !== this.normalizeCode(filter.institute_code)) return false;
      if (filter.course && this.normalizeCode(c.course) !== this.normalizeCode(filter.course)) return false;
      if (filter.category && this.normalizeCode(c.category) !== this.normalizeCode(filter.category)) return false;
      if (filter.year && c.year !== filter.year) return false;
      if (filter.round && c.round !== filter.round) return false;
      if (filter.max_rank && c.cutoff_rank > filter.max_rank) return false;
      return true;
    });
  }

  /**
   * Load entire dataset into memory with primary binary vault & .dat file fallback.
   */
  static async loadCutoffs(): Promise<CutoffData[]> {
    if (this.isLoaded && this.cutoffs.length > 0) {
      return this.cutoffs;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      // 1. Primary: Load complete high-volume master dataset (240,804 records, 2023-2026)
      try {
        const sources = [
          '/data/kcet_cutoffs_high_volume.dat',
          '/data/kcet_cutoffs_consolidated.dat',
          '/kcet_cutoffs_high_volume.dat',
          '/kcet_cutoffs_consolidated.dat',
          '/kcet_cutoffs.dat',
          '/kcet_cutoffs2025.dat'
        ];

        let response: Response | null = null;
        for (const url of sources) {
          try {
            const r = await fetch(url);
            if (r.ok) {
              response = r;
              break;
            }
          } catch {
            // try next url
          }
        }

        if (response) {
          const raw = await response.json();
          const dataArray: any[] = Array.isArray(raw)
            ? raw
            : (raw.cutoffs ?? raw.data ?? raw.cutoffs_data ?? []);

          if (dataArray.length > 0) {
            this.cutoffs = dataArray.map((item: any) => ({
              year: String(item.year || item.Year || "2025"),
              round: String(item.round || item.Round || "R1"),
              institute_code: String(item.institute_code || item.college_code || item.instituteCode || ""),
              course: String(item.course || item.branch_code || item.Course || ""),
              category: String(item.category || item.Category || "GM"),
              cutoff_rank: parseInt(item.cutoff_rank || item.cutoffRank || "0") || 0,
              college_name: String(item.college_name || item.collegeName || item.institute || ""),
              branch_name: String(item.branch_name || item.branchName || ""),
              total_seats: parseInt(item.total_seats || item.totalSeats || "0") || 0,
              available_seats: parseInt(item.available_seats || item.availableSeats || "0") || 0,
            }));

            this.isLoaded = true;
            return this.cutoffs;
          }
        }
      } catch (err) {
        console.error('High volume .dat fetch failed, trying vault fallback:', err);
      }

      // 2. Fallback to DataVault
      try {
        const vaultRecords = await DataVault.loadVault();
        if (vaultRecords && vaultRecords.length > 0) {
          this.cutoffs = vaultRecords;
          this.isLoaded = true;
          return this.cutoffs;
        }
      } catch (e) {
        console.warn('Vault fallback loader skipped:', e);
      }

      // Safe static fallback
      this.cutoffs = [
        { year: "2025", round: "R1", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 5000, college_name: "RV College of Engineering" },
        { year: "2025", round: "R2", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 5500, college_name: "RV College of Engineering" }
      ];
      this.isLoaded = true;
      return this.cutoffs;
    })();

    return this.loadPromise;
  }

  static getAvailableYears(): string[] {
    const years = Array.from(new Set(this.cutoffs.map(c => c.year)));
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  }

  static getAvailableRounds(year: string): string[] {
    const rounds = Array.from(new Set(
      this.cutoffs
        .filter(c => c.year === year)
        .map(c => c.round)
    ));
    return rounds.sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)?.[0] || "0");
      const bNum = parseInt(b.match(/\d+/)?.[0] || "0");
      return aNum - bNum;
    });
  }

  static getAvailableCategories(): string[] {
    const categories = Array.from(new Set(this.cutoffs.map(c => c.category)));
    return categories.sort();
  }

  static async simulateMockAllotment(
    userRank: number,
    userCategory: string,
    selectedYear: string,
    selectedRound: string,
    userOptions: any[]
  ): Promise<MockAllotmentResult[]> {
    await this.loadCutoffs();

    const results: MockAllotmentResult[] = [];
    const relevantCutoffs = this.cutoffs.filter(
      c => c.year === selectedYear && c.round === selectedRound
    );

    if (relevantCutoffs.length === 0) {
      return [{
        collegeCode: "",
        branchCode: "",
        collegeName: "",
        branchName: "",
        cutoff_rank: 0,
        year: selectedYear,
        round: selectedRound,
        category: userCategory,
        success: false,
        message: `No cutoff data available for ${selectedYear} - ${selectedRound}`
      }];
    }

    for (const option of userOptions) {
      const matchingCutoffs = relevantCutoffs.filter(
        c =>
          this.normalizeCode(c.institute_code) === this.normalizeCode(option.collegeCode) &&
          this.normalizeCode(c.course) === this.normalizeCode(option.branchCode) &&
          this.normalizeCode(c.category) === this.normalizeCode(userCategory)
      );

      if (matchingCutoffs.length === 0) {
        results.push({
          collegeCode: option.collegeCode,
          branchCode: option.branchCode,
          collegeName: option.collegeName,
          branchName: option.branchName,
          cutoff_rank: 0,
          year: selectedYear,
          round: selectedRound,
          category: userCategory,
          success: false,
          message: `No cutoff data found for ${option.collegeCode}${option.branchCode} in ${userCategory} category`
        });
        continue;
      }

      const bestCutoff = matchingCutoffs.reduce((best, current) => {
        if (current.cutoff_rank >= userRank && current.cutoff_rank < best.cutoff_rank) {
          return current;
        }
        return best;
      });

      if (userRank <= bestCutoff.cutoff_rank) {
        results.push({
          collegeCode: option.collegeCode,
          branchCode: option.branchCode,
          collegeName: bestCutoff.college_name || option.collegeName,
          branchName: bestCutoff.branch_name || option.branchName,
          cutoff_rank: bestCutoff.cutoff_rank,
          year: selectedYear,
          round: selectedRound,
          category: userCategory,
          success: true,
          message: `Likely Allotment! Your rank (${userRank}) is better than cutoff (${bestCutoff.cutoff_rank})`
        });
      } else {
        results.push({
          collegeCode: option.collegeCode,
          branchCode: option.branchCode,
          collegeName: bestCutoff.college_name || option.collegeName,
          branchName: bestCutoff.branch_name || option.branchName,
          cutoff_rank: bestCutoff.cutoff_rank,
          year: selectedYear,
          round: selectedRound,
          category: userCategory,
          success: false,
          message: `Missed by ${userRank - bestCutoff.cutoff_rank} ranks. Cutoff was ${bestCutoff.cutoff_rank}`
        });
      }
    }

    return results;
  }

  private static normalizeCode(code: string): string {
    return (code || "").trim().toUpperCase();
  }
}
