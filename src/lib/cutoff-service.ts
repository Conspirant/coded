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

export class CutoffService {
  private static cutoffs: CutoffData[] = [];
  private static isLoaded = false;

  static async loadCutoffs(): Promise<CutoffData[]> {
    if (this.isLoaded && this.cutoffs.length > 0) {
      return this.cutoffs;
    }

    try {
      // Try multiple sources, including new R3 2025 file
      const sources = [
        '/data/kcet_cutoffs_consolidated.json',
        '/kcet_cutoffs.json',
        '/kcet_cutoffs_round3_2025.json',
        '/kcet_cutoffs2025.json'
      ];
      let response: Response | null = null;
      for (const url of sources) {
        const r = await fetch(url, { cache: 'no-store' });
        if (r.ok) {
          response = r;
          break;
        }
      }
      if (!response) {
        throw new Error('No cutoff data source available');
      }
      
      const raw = await response.json();
      const dataArray: any[] = Array.isArray(raw)
        ? raw
        : (raw.cutoffs ?? raw.data ?? raw.cutoffs_data ?? []);
      
      // Transform the data to match our expected format
      this.cutoffs = dataArray.map((item: any) => ({
        year: item.year || item.Year || "2024",
        round: item.round || item.Round || "Round 1",
        institute_code: item.institute_code || item.college_code || item.instituteCode || "",
        course: item.course || item.branch_code || item.Course || "",
        category: item.category || item.Category || "GM",
        cutoff_rank: parseInt(item.cutoff_rank || item.cutoffRank || "0") || 0,
        college_name: item.college_name || item.collegeName || "",
        branch_name: item.branch_name || item.branchName || "",
        total_seats: parseInt(item.total_seats || item.totalSeats || "0") || 0,
        available_seats: parseInt(item.available_seats || item.availableSeats || "0") || 0,
      }));

      this.isLoaded = true;
      return this.cutoffs;
    } catch (error) {
      console.error('Failed to load cutoffs:', error);
      
      // Return fallback data
      this.cutoffs = [
        { year: "2024", round: "Round 1", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 5000 },
        { year: "2024", round: "Round 2", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 5500 },
        { year: "2024", round: "Round 3", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 6000 },
        { year: "2023", round: "Round 1", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 4800 },
        { year: "2023", round: "Round 2", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 5200 },
        { year: "2023", round: "Round 3", institute_code: "E001", course: "CS", category: "GM", cutoff_rank: 5700 },
      ];
      
      this.isLoaded = true;
      return this.cutoffs;
    }
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
      // Sort rounds logically: Round 1, Round 2, Round 3, etc.
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
    
    // Filter cutoffs based on selected year and round
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

    // Process each user option
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

      // Find the best matching cutoff
      const bestCutoff = matchingCutoffs.reduce((best, current) => {
        if (current.cutoff_rank >= userRank && current.cutoff_rank < best.cutoff_rank) {
          return current;
        }
        return best;
      }, matchingCutoffs[0]);

      if (bestCutoff && bestCutoff.cutoff_rank >= userRank) {
        results.push({
          collegeCode: option.collegeCode,
          branchCode: option.branchCode,
          collegeName: option.collegeName,
          branchName: option.branchName,
          cutoff_rank: bestCutoff.cutoff_rank,
          year: selectedYear,
          round: selectedRound,
          category: userCategory,
          success: true,
          message: `Congratulations! You would get ${option.collegeName} - ${option.branchName}`
        });
      } else {
        results.push({
          collegeCode: option.collegeCode,
          branchCode: option.branchCode,
          collegeName: option.collegeName,
          branchName: option.branchName,
          cutoff_rank: bestCutoff?.cutoff_rank || 0,
          year: selectedYear,
          round: selectedRound,
          category: userCategory,
          success: false,
          message: `Your rank ${userRank} is higher than the cutoff rank ${bestCutoff?.cutoff_rank || 'N/A'}`
        });
      }
    }

    return results;
  }

  private static normalizeCode(code: string): string {
    return (code || "").trim().toUpperCase();
  }

  static getCutoffStats(year: string, round: string, category: string) {
    const relevantCutoffs = this.cutoffs.filter(
      c => c.year === year && c.round === round && c.category === category
    );

    if (relevantCutoffs.length === 0) return null;

    const totalSeats = relevantCutoffs.reduce((sum, c) => sum + (c.total_seats || 0), 0);
    const availableSeats = relevantCutoffs.reduce((sum, c) => sum + (c.available_seats || 0), 0);
    const avgCutoff = relevantCutoffs.reduce((sum, c) => sum + c.cutoff_rank, 0) / relevantCutoffs.length;

    return {
      totalOptions: relevantCutoffs.length,
      totalSeats,
      availableSeats,
      averageCutoff: Math.round(avgCutoff),
      minCutoff: Math.min(...relevantCutoffs.map(c => c.cutoff_rank)),
      maxCutoff: Math.max(...relevantCutoffs.map(c => c.cutoff_rank))
    };
  }
}
