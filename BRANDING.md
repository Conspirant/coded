# KCET Coded – Brand & Visual Identity Guidelines

This document establishes the official design system, typography, visual assets, and voice guidelines for **KCET Coded**. 

To maintain a professional, reliable, and student-focused profile, **no AI buzzwords, promotional fluff, or exaggerated marketing claims are permitted in any page titles, descriptions, or copy.**

---

## 1. Brand Positioning & Voice

### Visual Persona
- **Direct & Utility-First:** The site must read as a high-quality analysis tool built by engineers/students for aspirants.
- **Data Transparency:** We prioritize source verification (such as direct PDF page mappings) over visual noise or speculative algorithms.
- **Objective Copy:** Do not use promotional statements or standard AI filler phrases.

### Strictly Forbidden Phrasing (AI Buzzwords)
Avoid any copy that sounds AI-generated, automated, or overhyped.
- **Do NOT use:** *"Revolutionize your counseling"*, *"Empower your options"*, *"Dive deep into data"*, *"Unlock your true potential"*, *"Seamlessly navigate"*
- **Instead, use:** *"Analyze previous year cutoffs"*, *"Verify cutoff records"*, *"Build preference lists"*, *"Estimate admissions probability"*

### Feature Nomenclature
To maintain a human-built, utility-first tone, use these official names across all routes and menus:
1. **Admissions Assistant** (previously: AI Counselor) – An automated reference helper for quick guideline lookup.
2. **College Finder** (previously: College Finder/Allotment Predictor) – Rank/category matching database.
3. **Cutoff Explorer** – Filterable historical cutoff records.
4. **Allotment Simulator** – Practice preference entry tool.

---

## 2. Typography

The platform utilizes a dual-font structure to balance modern aesthetics with dense data readability:

1. **Heading/Title Font:** **Plus Jakarta Sans**
   - Applied to: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, and classes matching `.font-brand`.
   - Style: Semi-bold to Extrabold with a tracking offset of `-0.01em` or `-0.02em` for premium, compact headings.
2. **Body/Data Font:** **Inter**
   - Applied to: General paragraphs, table records, inputs, rank predictions, numbers, and matrices.
   - Style: Designed for high legibility at small sizes.

---

## 3. Brand Mark & Logo

The logo represents a graduation cap intersecting with a data node linkage, representing counseling intelligence and official KEA statistics. It is loaded via the reusable React component:

```tsx
import { Logo } from "@/components/ui/Logo"

// Renders the dynamic logo matching active exam context
<Logo mode="KCET" iconSize={24} />
```

### Dynamic Logo Gradients
The logo gradient automatically adjusts based on the active exam mode state:
- **KCET mode:** Indigo to Violet (`#6366f1` to `#8b5cf6`).
- **COMEDK mode:** Amber to Orange (`#f59e0b` to `#ea580c`).
- **Default mode:** Red-yellow-indigo sunset gradient.

---

## 4. Visual Accent Themes

Each counseling context is branded with a distinct accent color theme, which dynamically changes the borders, badge backgrounds, indicator icons, and highlights:

| Exam Context | Primary Accent | Gradient Stops | Badge Styling |
| :--- | :--- | :--- | :--- |
| **KCET** | Indigo (`#6366f1`) | Indigo to Purple | `bg-indigo-500/10 text-indigo-400 border-indigo-500/20` |
| **COMEDK** | Amber (`#f59e0b`) | Amber to Orange | `bg-amber-500/10 text-amber-400 border-amber-500/20` |
| **Common/Admin** | Emerald (`#10b981`) | Teal to Emerald | `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` |

Ensure that all interactive states (hover indicators, sliders, buttons) adapt to `hsl(var(--primary))` or active mode variables rather than hardcoded tailwind colors where applicable.
