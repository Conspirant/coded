import * as fflate from 'fflate';
import { CutoffData } from './cutoff-service';

export interface PackedVaultData {
  v: number;
  totals: {
    records: number;
    colleges: number;
    branches: number;
  };
  dict: {
    i: [string, string][]; // [institute_code, institute_name]
    c: string[];           // course / branch names
    cat: string[];         // category names
    y: string[];           // years
    r: string[];           // rounds
  };
  rows: [number, number, number, number, number, number][]; // [instIdx, courseIdx, catIdx, yearIdx, roundIdx, rank]
}

export class DataVault {
  private static cachedRecords: CutoffData[] | null = null;
  private static isLoading = false;
  private static loadingPromise: Promise<CutoffData[]> | null = null;

  /**
   * Load and unpack the binary-packed and obfuscated cutoffs vault.
   */
  static async loadVault(): Promise<CutoffData[]> {
    if (this.cachedRecords && this.cachedRecords.length > 0) {
      return this.cachedRecords;
    }

    if (this.isLoading && this.loadingPromise) {
      return this.loadingPromise;
    }

    this.isLoading = true;
    this.loadingPromise = (async () => {
      try {
        const vaultUrls = ['/data/vault_core.bin', '/vault_core.bin'];
        let buffer: ArrayBuffer | null = null;

        for (const url of vaultUrls) {
          try {
            const resp = await fetch(url, { cache: 'force-cache' });
            if (resp.ok) {
              buffer = await resp.arrayBuffer();
              break;
            }
          } catch {
            // try next url
          }
        }

        if (buffer && buffer.byteLength > 6) {
          const bytes = new Uint8Array(buffer);

          // Check KCTV magic bytes
          if (bytes[0] === 0x4B && bytes[1] === 0x43 && bytes[2] === 0x54 && bytes[3] === 0x56) {
            const maskKey = bytes[5];
            const compressedPayload = new Uint8Array(bytes.length - 6);

            for (let i = 0; i < compressedPayload.length; i++) {
              compressedPayload[i] = bytes[i + 6] ^ maskKey;
            }

            // Decompress deflated payload with fflate
            const decompressed = fflate.inflateSync(compressedPayload);
            const textDecoder = new TextDecoder('utf-8');
            const jsonText = textDecoder.decode(decompressed);
            const vaultData: PackedVaultData = JSON.parse(jsonText);

            // Reconstruct typed CutoffData array
            const dict = vaultData.dict;
            const rows = vaultData.rows;
            const output: CutoffData[] = new Array(rows.length);

            for (let i = 0; i < rows.length; i++) {
              const [instId, courseId, catId, yearId, roundId, rank] = rows[i];
              const inst = dict.i[instId] || ['', ''];

              output[i] = {
                institute_code: inst[0],
                college_name: inst[1],
                course: dict.c[courseId] || '',
                category: dict.cat[catId] || '',
                year: dict.y[yearId] || '2025',
                round: dict.r[roundId] || 'R1',
                cutoff_rank: rank
              };
            }

            this.cachedRecords = output;
            this.isLoading = false;
            return output;
          }
        }
      } catch (err) {
        console.warn('Binary vault unpack failed, will fall back to .dat sources:', err);
      }

      this.isLoading = false;
      return [];
    })();

    return this.loadingPromise;
  }
}
