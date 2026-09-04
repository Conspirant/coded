import json
import zlib
import os
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
DATA = PUBLIC / "data"

print("=" * 70)
print("  VERIFYING 2026 INTEGRATION")
print("=" * 70)

# 1. cutoffs-2026.json
with open(DATA / "cutoffs-2026.json", "r", encoding="utf-8") as f:
    c2026 = json.load(f)
print(f"1. cutoffs-2026.json: {len(c2026):,} total records")
by_round_2026 = Counter(r["round"] for r in c2026)
for rnd, cnt in sorted(by_round_2026.items()):
    print(f"   - {rnd}: {cnt:,}")

# 2. kcet_cutoffs_consolidated.dat
with open(DATA / "kcet_cutoffs_consolidated.dat", "r", encoding="utf-8") as f:
    master = json.load(f)

if isinstance(master, dict):
    meta = master.get("metadata", {})
    total_entries = meta.get("total_entries", 0)
    print(f"\n2. Consolidated Master (.dat): {total_entries:,} total entries")
    print(f"   - Years covered: {meta.get('years_covered')}")
    print(f"   - Rounds covered: {meta.get('rounds_covered')}")
    print("   - Records by year/round:")
    for yr, cnt in sorted(meta.get("records_by_year_round", {}).items()):
        print(f"     * {yr}: {cnt:,}")
else:
    total_entries = len(master)
    print(f"\n2. Consolidated Master (.dat): {total_entries:,} total entries")
    by_yr = Counter(str(r.get("year")) for r in master)
    by_rnd = Counter(str(r.get("round")) for r in master)
    by_yr_rnd = Counter((str(r.get("year")), str(r.get("round"))) for r in master)
    print(f"   - Years covered: {sorted(by_yr.keys())}")
    print(f"   - Rounds covered: {sorted(by_rnd.keys())}")
    print("   - Records by year/round:")
    for (yr, rnd), cnt in sorted(by_yr_rnd.items()):
        print(f"     * {yr}_{rnd}: {cnt:,}")

# 3. cutoffs-summary.json
with open(DATA / "cutoffs-summary.json", "r", encoding="utf-8") as f:
    summary = json.load(f)
print(f"\n3. Summary Stats:")
print(f"   - Total records: {summary.get('totals', {}).get('records', 0):,}")
print(f"   - Total colleges: {summary.get('totals', {}).get('colleges', 0):,}")
print(f"   - Total branches: {summary.get('totals', {}).get('branches', 0):,}")
print(f"   - Year breakdown: {summary.get('years', {})}")

# 4. vault_core.bin
with open(DATA / "vault_core.bin", "rb") as f:
    vault_bytes = f.read()
magic = vault_bytes[:6]
body = vault_bytes[6:]
unmasked = bytes(b ^ 0xA7 for b in body)
decompressed = zlib.decompress(unmasked)
vault_obj = json.loads(decompressed.decode("utf-8"))
print(f"\n4. Binary Vault (vault_core.bin):")
print(f"   - Vault size: {len(vault_bytes) / 1024:.1f} KB")
print(f"   - Decoded records: {vault_obj['totals']['records']:,}")
print(f"   - Decoded colleges: {vault_obj['totals']['colleges']:,}")
print(f"   - Decoded branches: {vault_obj['totals']['branches']:,}")
print(f"   - Vault rounds: {vault_obj['dict']['r']}")

# 5. pdf-page-index.dat
with open(DATA / "pdf-page-index.dat", "r", encoding="utf-8") as f:
    page_idx = json.load(f)
keys = list(page_idx.get("index", {}).keys())
print(f"\n5. PDF Page Index:")
print(f"   - Indexed PDFs: {len(keys)}")
print(f"   - Keys: {keys}")
mock2_count = len(page_idx.get("index", {}).get("2026-MOCK2", {}))
r1_count = len(page_idx.get("index", {}).get("2026-R1", {}))
r2_count = len(page_idx.get("index", {}).get("2026-R2", {}))
r3_count = len(page_idx.get("index", {}).get("2026-R3", {}))
print(f"   - 2026-MOCK2 mapped colleges: {mock2_count}")
print(f"   - 2026-R1 mapped colleges: {r1_count}")
print(f"   - 2026-R2 mapped colleges: {r2_count}")
print(f"   - 2026-R3 mapped colleges: {r3_count}")

# 6. Canonical PDF files
print(f"\n6. Canonical PDF Check:")
print(f"   - public/cutoffs/kcet-2026-mock-round1-cutoffs.pdf: {os.path.exists(PUBLIC / 'cutoffs' / 'kcet-2026-mock-round1-cutoffs.pdf')}")
print(f"   - public/cutoffs/kcet-2026-mock-round2-cutoffs.pdf: {os.path.exists(PUBLIC / 'cutoffs' / 'kcet-2026-mock-round2-cutoffs.pdf')}")
print(f"   - public/cutoffs/kcet-2026-round1-cutoffs.pdf: {os.path.exists(PUBLIC / 'cutoffs' / 'kcet-2026-round1-cutoffs.pdf')}")
print(f"   - public/cutoffs/kcet-2026-round2-cutoffs.pdf: {os.path.exists(PUBLIC / 'cutoffs' / 'kcet-2026-round2-cutoffs.pdf')}")
print(f"   - public/cutoffs/kcet-2026-round3-cutoffs.pdf: {os.path.exists(PUBLIC / 'cutoffs' / 'kcet-2026-round3-cutoffs.pdf')}")
print(f"   - kcet-2026-round3-cutoffs.pdf (root): {os.path.exists(ROOT / 'kcet-2026-round3-cutoffs.pdf')}")
print("=" * 70)
