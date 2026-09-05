# Archived Features: NEET Hub & COMEDK

This directory contains the complete source code, pages, components, datasets, and utilities for **NEET Hub** and **COMEDK** that were removed from the active KCET Coded frontend.

All code and assets in this folder are fully preserved and intact.

---

## Directory Structure

### 1. `neethub/`
Karnataka UG-NEET Medical & Dental admissions suite:
- **`pages/`**:
  - `NeetHub.tsx` — Main NEET Medical admissions landing and hub dashboard.
  - `NeetCollegePredictor.tsx` — NEET AIR to Karnataka Medical/Dental college predictor.
  - `NeetOptionBuilder.tsx` — KEA 3-tier priority sequence builder for medical choices.
  - `NeetChoiceSimulatorPage.tsx` — KEA Choice 1/2/3/4 medical round decision simulator.
  - `NeetCompare.tsx` — Side-by-side medical college and hospital bed comparator.
  - `NeetExplorer.tsx` — Karnataka UG-NEET cutoff ranks explorer.
  - `NeetFeeCalculator.tsx` — Karnataka MBBS/BDS fee structure & 5.5-year cost breakdown.
  - `NeetMatrixView.tsx` — Grid matrix view of medical cutoffs across categories.
  - `NeetQuotas.tsx` — Karnataka NEET quota, AIQ vs State, and rural bond guidelines.
  - `NeetRankPredictor.tsx` — NEET score (out of 720) to AIR and Karnataka state rank predictor.
  - `NeetTrends.tsx` — Mock vs final cutoff trends analyzer.
- **`components/`**:
  - `ChoiceSimulator.tsx` — Interactive choice decision tree component.
  - `CollegeComparator.tsx` — College comparison matrix.
  - `OptionEntryBuilder.tsx` — Priority entry list builder.
  - `QuotaMatrix.tsx` — Quota breakdown view.
- **`data/`**:
  - `neetMedicalData.ts` — Karnataka medical colleges metadata, hospital beds, affiliations.
  - `neet2026Data.ts` — Mock and final cutoff datasets, fee structures.
- **`lib/`**:
  - `neet-rank-predictor.ts` — Calibrated score inflation and state rank prediction model.

### 2. `comedk/`
COMEDK UGET counseling tools:
- **`pages/`**:
  - `ComedkExplorer.tsx` — COMEDK cutoff explorer with official PDF source links.
  - `ComedkRankPredictor.tsx` — Community-reported shift-wise marks vs rank predictor.
- **`lib/`**:
  - `comedk-rank-predictor.ts` — Deduplicated r/comedk dataset and weighted interpolation model.
  - `parse-comedk.js` — Parser script for reddit marks-vs-rank data.
- **`data/`**:
  - `comedk_cutoffs.dat` — Full cutoff dataset for COMEDK GM, HKR, and KKR categories.

---

## How to Restore

If you ever wish to re-enable either feature:
1. Move the pages back to `src/pages/`.
2. Move components, data, and lib back to their respective paths in `src/`.
3. Re-register routes in `src/App.tsx`.
4. Re-add navigation items to `src/components/AppSidebar.tsx` and `src/components/MobileNav.tsx`.
