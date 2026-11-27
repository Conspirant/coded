"""
Extract all 1-mark MCQs and Fill-in-the-Blanks (with diagrams and answer keys)
from the official KSEAB 2nd PUC Question Bank PDFs for Physics, Chemistry, and Mathematics.
"""
import json
import os
import re
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parent.parent
OUT_DATA_DIR = ROOT / "src" / "data" / "puc-qb"
OUT_IMG_DIR = ROOT / "public" / "puc-qb-images"

OUT_DATA_DIR.mkdir(parents=True, exist_ok=True)
OUT_IMG_DIR.mkdir(parents=True, exist_ok=True)

PDF_CONFIGS = {
    "physics": {
        "path": ROOT / "public" / "puc-papers" / "KSEAB_2ndPUC_Physics_Question_Bank_2025-26.pdf",
        "subjectCode": "33",
        "subjectName": "Physics",
        "chapters": [
            (1, "Electric Charges and Fields"),
            (2, "Electrostatic Potential and Capacitance"),
            (3, "Current Electricity"),
            (4, "Moving Charges and Magnetism"),
            (5, "Magnetism and Matter"),
            (6, "Electromagnetic Induction"),
            (7, "Alternating Current"),
            (8, "Electromagnetic Waves"),
            (9, "Ray Optics and Optical Instruments"),
            (10, "Wave Optics"),
            (11, "Dual Nature of Radiation and Matter"),
            (12, "Atoms"),
            (13, "Nuclei"),
            (14, "Semiconductor Electronics"),
        ],
    },
    "chemistry": {
        "path": ROOT / "public" / "puc-papers" / "KSEAB_2ndPUC_Chemistry_Question_Bank_2025-26.pdf",
        "subjectCode": "34",
        "subjectName": "Chemistry",
        "chapters": [
            (1, "Solutions"),
            (2, "Electrochemistry"),
            (3, "Chemical Kinetics"),
            (4, "The d & f Block Elements"),
            (5, "Coordination Compounds"),
            (6, "Haloalkanes and Haloarenes"),
            (7, "Alcohols, Phenols and Ethers"),
            (8, "Aldehydes, Ketones and Carboxylic Acids"),
            (9, "Amines"),
            (10, "Biomolecules"),
        ],
    },
    "mathematics": {
        "path": ROOT / "public" / "puc-papers" / "KSEAB_2ndPUC_Mathematics_Question_Bank_2025-26.pdf",
        "subjectCode": "35",
        "subjectName": "Mathematics",
        "chapters": [
            (1, "Relations and Functions"),
            (2, "Inverse Trigonometric Functions"),
            (3, "Matrices"),
            (4, "Determinants"),
            (5, "Continuity and Differentiability"),
            (6, "Application of Derivatives"),
            (7, "Integrals"),
            (8, "Application of Integrals"),
            (9, "Differential Equations"),
            (10, "Vector Algebra"),
            (11, "Three Dimensional Geometry"),
            (12, "Linear Programming"),
            (13, "Probability"),
        ],
    },
}

HEADER_NOISE_RE = re.compile(
    r"(Department of School Education|Karnataka School Examination|SUBJECT:\s*\d+|II PUC\s*[–-]\s*\d+|Page \d+ of \d+)",
    re.I,
)

PUA_RE = re.compile(r"[\uf000-\uffff]")

# Standard Windows Symbol / Wingdings PUA (0xF000 + ASCII) mapping
SYMBOL_PUA_MAP = {
    "\uf061": "α", "\uf062": "β", "\uf067": "γ", "\uf064": "δ", "\uf065": "ε",
    "\uf07a": "ζ", "\uf068": "η", "\uf071": "θ", "\uf06b": "κ", "\uf06c": "λ",
    "\uf06d": "μ", "\uf06e": "ν", "\uf070": "π", "\uf072": "ρ", "\uf073": "σ",
    "\uf074": "τ", "\uf066": "φ", "\uf06a": "φ", "\uf077": "ω", "\uf057": "Ω",
    "\uf044": "Δ", "\uf04c": "Λ", "\uf053": "Σ", "\uf046": "Φ", "\uf059": "Ψ", "\uf050": "Π",
    "\uf0b4": "×", "\uf0b8": "÷", "\uf0b1": "±", "\uf0b5": "∝", "\uf0a5": "∞",
    "\uf0a3": "≤", "\uf0b3": "≥", "\uf0b9": "≠", "\uf0bb": "≈", "\uf0ae": "→",
    "\uf0ab": "↔", "\uf0ac": "←", "\uf0e0": "→", "\uf0ce": "∈", "\uf0cf": "∉", "\uf022": "∀",
    "\uf024": "∃", "\uf0d1": "∇", "\uf0b6": "∂", "\uf0d6": "√", "\uf0e5": "∑",
    "\uf0f2": "∫", "\uf0b0": "°", "\uf02d": "−", "\uf02b": "+", "\uf03d": "=",
    "\uf03c": "<", "\uf03e": ">", "\uf05b": "[", "\uf05d": "]", "\uf07b": "{", "\uf07d": "}",
    "\uf0a2": "′", "\uf0b2": "″", "\uf0c7": "∩", "\uf0c8": "∪", "\uf0cc": "⊂",
    "\uf0d0": "∠", "\uf0d7": "⋅",
    "\uf020": " ", "\uf0a0": " ",
}


import unicodedata


def normalize_math_unicode(s: str) -> str:
    """Convert Unicode Mathematical Alphanumeric Symbols (U+1D400..U+1D7FF, e.g. 𝐴, 𝑛, 𝐶) to ASCII."""
    out = []
    for ch in s:
        cp = ord(ch)
        if 0x1D400 <= cp <= 0x1D7FF:
            nk = unicodedata.normalize("NFKC", ch)
            out.append(nk if nk else ch)
        else:
            out.append(ch)
    return "".join(out)


def decode_pua(s: str) -> str:
    s = normalize_math_unicode(s)
    for k, v in SYMBOL_PUA_MAP.items():
        if k in s:
            s = s.replace(k, v)
    return PUA_RE.sub("", s)

DIFF_MAP = {
    "(E)": "Easy",
    "(Easy)": "Easy",
    "(A)": "Average",
    "(Average)": "Average",
    "(D)": "Difficult",
    "(Difficult)": "Difficult",
    "(H)": "Difficult",
}


def clean_text(s: str) -> str:
    s = s.replace("\u2044", "/")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    # Wrap bare LaTeX tokens with chained or 1-level nested sub/superscripts (e.g. e^{x^{3}}, λ_{SO_{4}^{2-}}) in $...$
    parts = re.split(r"(\$[^\$]+\$)", s)
    nested_sub = r"(?:[_^]\{(?:[^{}]|\{[^{}]*\})+\})"
    for i in range(0, len(parts), 2):
        parts[i] = re.sub(rf"([A-Za-z0-9α-ωΑ-Ω°\)\]]+{nested_sub}+)", r"$\1$", parts[i])
        sub_parts = re.split(r"(\$[^\$]+\$)", parts[i])
        for j in range(0, len(sub_parts), 2):
            sub_parts[j] = re.sub(rf"({nested_sub})", r"$\1$", sub_parts[j])
        parts[i] = "".join(sub_parts).replace("$$", "")
    out = "".join(parts).strip()
    # Fix adjacent ^{a}_{b}^{c} (e.g. E^{0}_{Cell}^{-}) inside a token -> {E^{0}_{Cell}}^{-}
    out = re.sub(
        r"([A-Za-z0-9α-ωΑ-Ω°\)\]]+\^\{(?:[^{}]|\{[^{}]*\})+\}_\{(?:[^{}]|\{[^{}]*\})+\})\^\{",
        r"{\1}^{",
        out,
    )
    # Balance any stray unclosed $ sign
    if len(re.findall(r"(?<!\\)\$", out)) % 2 != 0:
        idx_last = out.rfind("$")
        if idx_last != -1:
            out = out[:idx_last] + out[idx_last + 1 :]
    return out


def strip_difficulty(s: str):
    diff = None
    def _repl(m):
        nonlocal diff
        inner = m.group(1) or m.group(2)
        tag = "(" + inner + ")"
        if len(inner) > 1:
            tag = "(" + inner.capitalize() + ")"
        if diff is None:
            diff = DIFF_MAP.get(tag)
        return ""
    s = re.sub(r"[ \t]*(?:\((Easy|Average|Difficult|[EADH])\)|\[([EADH])\])[ \t]*(?=\n|$)", _repl, s)
    return clean_text(s), diff


def crop_bbox(
    page: pymupdf.Page,
    bbox,
    out_path: Path,
    pad: int = 4,
    min_y: float | None = None,
    max_y: float | None = None,
) -> str:
    rx0 = bbox[0] - pad
    ry0 = bbox[1] - pad
    rx1 = bbox[2] + pad
    ry1 = bbox[3] + pad
    if min_y is not None:
        ry0 = max(ry0, min_y)
    if max_y is not None:
        ry1 = min(ry1, max_y)
    rect = pymupdf.Rect(rx0, ry0, rx1, ry1) & page.rect
    if rect.width < 8 or rect.height < 8:
        return ""
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2.5, 2.5), clip=rect)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(str(out_path))
    rel = out_path.relative_to(ROOT / "public").as_posix()
    return f"/{rel}"


def get_page_images(page: pymupdf.Page):
    imgs = []
    seen = []
    for info in page.get_image_info(xrefs=True):
        b = info.get("bbox")
        if not b:
            continue
        w = b[2] - b[0]
        h = b[3] - b[1]
        # Ignore tiny decorative icons or full-page watermarks/borders
        if w < 12 or h < 12 or (w > 480 and h > 550) or h > 360:
            continue
        rb = (round(b[0], 1), round(b[1], 1), round(b[2], 1), round(b[3], 1))
        if rb not in seen:
            seen.append(rb)
            imgs.append(b)
    return imgs


def find_vector_diagram_bbox(page: pymupdf.Page, y0: float, y1: float):
    """Detect non-trivial vector drawings (organic reaction bonds, circuits, graphs) inside [y0, y1]."""
    rects = []
    for d in page.get_drawings():
        r = d.get("rect")
        if not r:
            continue
        w = r.x1 - r.x0
        h = r.y1 - r.y0
        # Ignore page frames, full header rules, tiny underlines/fraction bars
        if h > 320 or (w > 480 and h > 220) or r.y0 < 56.0:
            continue
        if h <= 2.5 and w <= 160.0:
            continue
        if r.y1 >= y0 - 4 and r.y0 <= y1 + 4:
            if w >= 5 or h >= 5:
                rects.append(r)
    if not rects:
        return None
    vx0 = min(r.x0 for r in rects)
    vy0 = min(r.y0 for r in rects)
    vx1 = max(r.x1 for r in rects)
    vy1 = max(r.y1 for r in rects)
    if (vx1 - vx0) >= 24.0 and (vy1 - vy0) >= 16.0 and (vy1 - vy0) <= 320.0:
        return (vx0, vy0, vx1, vy1)
    return None


TALL_BRACKET_PUA = {
    0xF0E6, 0xF0E7, 0xF0E8, 0xF0E9, 0xF0EA, 0xF0EB, 0xF0EC, 0xF0ED, 0xF0EE,
    0xF0F6, 0xF0F7, 0xF0F8, 0xF0F9, 0xF0FA, 0xF0FB, 0xF0FC, 0xF0FD, 0xF0FE,
}


def detect_2d_math_in_range(page: pymupdf.Page, y0: float, y1: float) -> bool:
    """Detect genuine 2D multi-row matrices, determinants, or piecewise braces inside [y0, y1]."""
    vbar_rows = {}  # round(oy) -> list of (x0, x1)
    bracket_rows = {}  # round(oy) -> list of (x0, x1, st_dec) for midline stretched '[' ']'
    span_pts = []   # (oy, x0, x1, text)
    brace_oys = []  # (oy, ord_c) for piecewise '{' / middle extenders
    paren_pts = []  # (oy, x0, x1) for tall '(' ')' brackets
    d = page.get_text("dict")
    for b in d.get("blocks", []):
        if b.get("type") != 0:
            continue
        for l in b.get("lines", []):
            for sp in l.get("spans", []):
                oy = sp.get("origin", (0, sp["bbox"][3]))[1]
                if oy < y0 - 2.0 or oy > y1 + 2.0:
                    continue
                t = sp.get("text", "")
                if not t.strip():
                    continue
                for c in t:
                    oc = ord(c)
                    if oc in TALL_BRACKET_PUA:
                        # Square brackets '[' ']', curly braces '{' '}', or 3-row paren extenders
                        if oc in (0xF0E9, 0xF0EA, 0xF0EB, 0xF0EC, 0xF0ED, 0xF0EE, 0xF0F9, 0xF0FA, 0xF0FB, 0xF0FC, 0xF0FD, 0xF0FE, 0xF0E7, 0xF0F7):
                            brace_oys.append((oy, sp["bbox"][0], sp["bbox"][2]))
                        else:
                            paren_pts.append((oy, sp["bbox"][0], sp["bbox"][2]))
                st_dec = decode_pua(t).strip()
                if st_dec == "|" and sp.get("size", 11.0) >= 14.5:
                    return True
                span_pts.append((oy, sp["bbox"][0], sp["bbox"][2], st_dec))
                if st_dec == "|":
                    vbar_rows.setdefault(round(oy, 0), []).append((sp["bbox"][0], sp["bbox"][2]))
                elif st_dec in ("[", "]"):
                    bracket_rows.setdefault(round(oy, 0), []).append((sp["bbox"][0], sp["bbox"][2], st_dec))
    # Midline stretched '[' ']' matrix brackets flanked by rows above AND below inside [x_left, x_right] (e.g. Ch4 Q6/Q7)
    for my, bs in bracket_rows.items():
        lefts = [x[0] for x in bs if x[2] == "["]
        rights = [x[1] for x in bs if x[2] == "]"]
        for lx in lefts:
            r_cands = [rx for rx in rights if 6.0 <= rx - lx <= 160.0]
            if r_cands:
                rx = min(r_cands)
                has_above = any(my - 18.0 <= soy <= my - 3.5 and sx1 >= lx and sx0 <= rx and st for soy, sx0, sx1, st in span_pts)
                has_below = any(my + 3.5 <= soy <= my + 18.0 and sx1 >= lx and sx0 <= rx and st for soy, sx0, sx1, st in span_pts)
                if has_above and has_below:
                    return True
    # Genuine multi-row matrix / piecewise brace glyphs: ensure 2+ non-fraction rows inside bracket x-span
    if len(brace_oys) >= 2 and (max(p[0] for p in brace_oys) - min(p[0] for p in brace_oys)) >= 4.0:
        bx_min = min(p[1] for p in brace_oys)
        bx_max = max(p[2] for p in brace_oys)
        by_min = min(p[0] for p in brace_oys) - 4.0
        by_max = max(p[0] for p in brace_oys) + 4.0
        inner_oys = {round(soy / 3.0) for soy, sx0, sx1, st in span_pts if by_min <= soy <= by_max and bx_min <= sx0 <= bx_max and st}
        if len(inner_oys) >= 2:
            return True
    if len(paren_pts) >= 4 and (max(p[0] for p in paren_pts) - min(p[0] for p in paren_pts)) >= 10.0:
        return True
    # Single middle '|' line flanked by entries above AND below inside the bar x-span (e.g. Ch4 Q2, Q3, Q4)
    for my, xs in vbar_rows.items():
        if len(xs) >= 2:
            bx_min = min(x[0] for x in xs) - 2.0
            bx_max = max(x[1] for x in xs) + 2.0
            has_above = any(my - 18.0 <= soy <= my - 4.0 and sx1 >= bx_min and sx0 <= bx_max and st for soy, sx0, sx1, st in span_pts)
            has_below = any(my + 4.0 <= soy <= my + 18.0 and sx1 >= bx_min and sx0 <= bx_max and st for soy, sx0, sx1, st in span_pts)
            if has_above and has_below:
                return True
    # Aligned 2-row standalone '|' pairs (e.g. 2x2 determinant drawn with 2 stacked '|' chars per edge)
    sorted_vys = sorted(vbar_rows.keys())
    for i in range(len(sorted_vys) - 1):
        y_a, y_b = sorted_vys[i], sorted_vys[i + 1]
        if 7.0 <= y_b - y_a <= 26.0:
            aligned_cols = sum(1 for xa in vbar_rows[y_a] if any(abs(xa[0] - xb[0]) <= 4.0 for xb in vbar_rows[y_b]))
            if aligned_cols >= 2:
                return True
    for dr in page.get_drawings():
        r = dr.get("rect")
        if not r:
            continue
        w = r.x1 - r.x0
        h = r.y1 - r.y0
        if w <= 6.0 and h >= 3.0 * max(w, 0.5) and 16.0 <= h <= 110.0 and r.y1 >= y0 - 2.0 and r.y0 <= y1 + 2.0 and 30.0 <= r.x0 <= 565.0:
            return True
    return False


def _append_sub_sup(base: str, op: str, val: str) -> str:
    """Safely attach a superscript/subscript without creating double ^{a}^{b} / _{a}_{b} KaTeX errors."""
    v = val.replace("$", "").strip()
    if not v:
        return base
    base_r = base.rstrip()
    if op == "^":
        m_end_sup = re.search(r"\^\{((?:[^{}]|\{[^{}]*\})+)\}$", base_r)
        if m_end_sup:
            inner = m_end_sup.group(1)
            # If inner already contains a nested ^{ (e.g. e^{tan^{-1}} + x), append horizontally inside exponent
            if "^{" in inner or "^" in inner:
                return base_r[:-1] + " " + v + "}"
            return base_r[:-1] + "^{" + v + "}}"
        # Superscript following a subscript when base token already has ^ before _ (e.g. E^{0}_{Cell} + -)
        if re.search(r"\^\{[^{}]+\}_\{[^{}]+\}$", base_r):
            return f"{{{base_r}}}^{{{v}}}"
    elif op == "_":
        m_end_sub = re.search(r"_\{((?:[^{}]|\{[^{}]*\})+)\}$", base_r)
        if m_end_sub:
            return base_r[:-1] + v + "}"
    return base_r + f"{op}{{{v}}}"


def attach_sub_sup(spans_list):
    """Attach adjacent superscripts/subscripts onto preceding span using baseline `oy`."""
    spans_list.sort(key=lambda s: (s["x0"], s["oy"]))
    for i, s1 in enumerate(spans_list):
        if s1["used"] or re.search(r"(?:\([A-Da-d]\)|[A-Da-d][.)])$", s1["text"].strip()):
            continue
        last_sup_oy = None
        for j in range(i + 1, len(spans_list)):
            s2 = spans_list[j]
            if s2["used"]:
                continue
            if s2["x0"] - s1["x1"] > 4.0:
                break
            if -1.5 <= s2["x0"] - s1["x1"] <= 4.0 and s2["size"] <= 9.5 and s2["size"] < s1["size"] - 0.8:
                dy_sub = s2["oy"] - s1["oy"]
                if -8.5 <= dy_sub <= 6.0:
                    if dy_sub <= -1.2:
                        s1["text"] = _append_sub_sup(s1["text"], "^", s2["text"])
                        last_sup_oy = s2["oy"]
                    elif dy_sub >= 1.2:
                        s1["text"] = _append_sub_sup(s1["text"], "_", s2["text"])
                    else:
                        s1["text"] += s2["text"]
                    s1["x1"] = max(s1["x1"], s2["x1"])
                    s2["used"] = True
            elif (
                last_sup_oy is not None
                and s2["size"] >= 9.5
                and -1.5 <= s2["x0"] - s1["x1"] <= 4.0
                and abs(s2["oy"] - last_sup_oy) <= 2.5
                and abs(s2["oy"] - s1["oy"]) <= 8.5
                and re.match(r"^\s*[+\-−=±\),.;]", s2["text"])
            ):
                # Snap elevated operator text (e.g. ' + c' inheriting exponent oy in e^{x^3} + c) back onto base oy
                s2["oy"] = s1["oy"]
                last_sup_oy = None
    return [s for s in spans_list if not s["used"]]


def merge_same_baseline(spans_list):
    """Merge horizontally adjacent spans on the exact same baseline `oy`."""
    spans_list.sort(key=lambda s: (round(s["oy"] / 1.5), s["x0"]))
    out = []
    for sp in spans_list:
        if (
            out
            and abs(sp["oy"] - out[-1]["oy"]) <= 1.5
            and -1.5 <= sp["x0"] - out[-1]["x1"] <= 3.5
            and abs(sp["size"] - out[-1]["size"]) <= 2.5
            and not re.search(r"(?:\([A-Da-d]\)|[A-Da-d][.)])$", out[-1]["text"].strip())
        ):
            out[-1]["text"] += sp["text"]
            out[-1]["x1"] = max(out[-1]["x1"], sp["x1"])
            out[-1]["y0"] = min(out[-1]["y0"], sp["y0"])
            out[-1]["y1"] = max(out[-1]["y1"], sp["y1"])
        else:
            out.append(sp)
    return out


def extract_lines_with_y(page: pymupdf.Page, detect_fractions: bool = True):
    """
    Extract lines using true PDF text baseline (`origin[1]`) and exact drawn fraction bars:
    - Decodes Symbol PUA & Unicode math glyphs
    - Detects PDF fraction bars (`page.get_drawings()`), gathers numerator/denominator spans
      above and below each bar, formats sub/superscripts inside them, and builds $\\frac{num}{denom}$
    - Merges same-baseline fragments (e.g. 'The p'+'rincipal') and attaches remaining sub/superscripts
    - Keeps Match-the-Following table columns separate from left-column options
    Returns list of (oy, x0, x1, y1, text).
    """
    d = page.get_text("dict")
    raw_spans = []
    for block in d.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            for sp in line.get("spans", []):
                txt = decode_pua(sp.get("text", ""))
                if not txt.strip():
                    continue
                bbox = sp["bbox"]
                ox, oy = sp.get("origin", (bbox[0], bbox[3]))
                if oy < 54.0 or (oy > 785.0 and re.fullmatch(r"[\d\s]+", txt.strip())):
                    continue
                raw_spans.append({
                    "x0": bbox[0], "y0": bbox[1], "x1": bbox[2], "y1": bbox[3],
                    "oy": oy,
                    "size": sp.get("size", 12.0),
                    "text": txt,
                    "used": False,
                })

    # 0. Inject inline vector absolute-value bars '|' (e.g. |x|, |x-2| drawn as 10..17pt vertical lines)
    horiz_lines = [
        dr["rect"] for dr in page.get_drawings()
        if dr.get("rect") and (dr["rect"].y1 - dr["rect"].y0) <= 2.5 and (dr["rect"].x1 - dr["rect"].x0) >= 18.0
    ]
    for dr in page.get_drawings():
        r = dr.get("rect")
        if not r:
            continue
        w = r.x1 - r.x0
        h = r.y1 - r.y0
        if w <= 1.8 and 10.0 <= h <= 17.5 and 54.0 <= r.y0 <= 785.0 and 30.0 <= r.x0 <= 565.0:
            touches_h = any(
                (hr.x0 - 3.0 <= r.x0 <= hr.x1 + 3.0) and (abs(hr.y0 - r.y0) < 3.0 or abs(hr.y0 - r.y1) < 3.0)
                for hr in horiz_lines
            )
            if not touches_h:
                raw_spans.append({
                    "x0": r.x0, "y0": r.y0, "x1": max(r.x1, r.x0 + 1.0), "y1": r.y1,
                    "oy": r.y1 - 4.2, "size": 11.5, "text": "|", "used": False,
                })

    # 0b. Inject vector-drawn square-root radicals '√' when diagonal tick (w>=2.0) meets horizontal vinculum bar
    short_horiz_bars = [
        dr["rect"] for dr in page.get_drawings()
        if dr.get("rect") and (dr["rect"].y1 - dr["rect"].y0) <= 2.5 and 3.0 <= (dr["rect"].x1 - dr["rect"].x0) <= 65.0
    ]
    vinculum_bars = set()
    for dr in page.get_drawings():
        r = dr.get("rect")
        if not r:
            continue
        w = r.x1 - r.x0
        h = r.y1 - r.y0
        if 2.0 <= w <= 5.5 and 9.0 <= h <= 18.5 and 54.0 <= r.y0 <= 785.0 and 30.0 <= r.x0 <= 565.0:
            for hr in short_horiz_bars:
                hw = hr.x1 - hr.x0
                if 3.0 <= hw <= 45.0 and abs(hr.x0 - r.x1) <= 2.5 and abs(hr.y0 - r.y0) <= 2.5:
                    vinculum_bars.add((round(hr.x0, 1), round(hr.y0, 1), round(hr.x1, 1)))
                    raw_spans.append({
                        "x0": r.x0, "y0": r.y0, "x1": r.x1, "y1": r.y1,
                        "oy": r.y1 - 1.5, "size": 11.0, "text": "√", "used": False,
                    })
                    break

    # 1. Exact Fraction-Bar Reconstruction (using PDF drawn horizontal bars, excluding table borders & vinculums)
    frac_bars = []
    if detect_fractions:
        vert_xs = []
        for dr in page.get_drawings():
            r = dr.get("rect")
            if not r:
                continue
            w = r.x1 - r.x0
            h = r.y1 - r.y0
            if w <= 2.5 and h >= 8.0:
                vert_xs.append(r)
        for dr in page.get_drawings():
            r = dr.get("rect")
            if not r:
                continue
            w = r.x1 - r.x0
            h = r.y1 - r.y0
            if h <= 2.5 and 3.5 <= w <= 160.0 and 54.0 <= r.y0 <= 785.0:
                if (round(r.x0, 1), round(r.y0, 1), round(r.x1, 1)) in vinculum_bars:
                    continue
                # Skip horizontal table cell borders that touch vertical table dividers
                touches_vert = any(
                    (abs(vr.x0 - r.x0) < 3.0 or abs(vr.x0 - r.x1) < 3.0)
                    and (vr.y0 - 3.0 <= r.y0 <= vr.y1 + 3.0)
                    for vr in vert_xs
                )
                if not touches_vert:
                    frac_bars.append(r)

    frac_spans = []
    # Process shorter/exponent bars before wide bars to avoid stealing numerator/denominator spans
    frac_bars.sort(key=lambda r: (r.x1 - r.x0, r.y0))
    for bar in frac_bars:
        bx0, by0, bx1, by1 = bar.x0, bar.y0, bar.x1, bar.y1
        bw = bx1 - bx0
        max_up = 11.5 if bw < 16.0 else 14.0
        max_dn = 16.0 if bw < 16.0 else 16.5
        num_cands = []
        den_cands = []
        for sp in raw_spans:
            if sp["used"]:
                continue
            scx = (sp["x0"] + sp["x1"]) / 2.0
            stxt_s = sp["text"].strip()
            if stxt_s in (",", ")", "]", "(", "[", ";", ":", "."):
                continue
            if bx0 - 1.5 <= scx <= bx1 + 1.5 and sp["x1"] - sp["x0"] <= bw + 8.0:
                if by0 - max_up <= sp["oy"] <= by0 + 1.2:
                    num_cands.append(sp)
                elif by1 + 1.5 <= sp["oy"] <= by1 + max_dn:
                    den_cands.append(sp)
        # Recover numerator split when a span straddles left prefix + trailing token above the bar (e.g. '−1 x' over '/a')
        if not num_cands and den_cands:
            for sp in raw_spans:
                if sp["used"] or sp["x0"] >= bx0 or not (bx0 - 1.0 <= sp["x1"] <= bx1 + 2.5):
                    continue
                if by0 - max_up <= sp["oy"] <= by0 + 1.2:
                    m_sp = re.match(r"^(.+?\s+)(\S{1,4})$", sp["text"])
                    if m_sp:
                        prefix_t, num_tok = m_sp.group(1), m_sp.group(2)
                        sp["text"] = prefix_t
                        sp["x1"] = bx0 - 1.5
                        num_cands.append({
                            "x0": bx0, "y0": sp["y0"], "x1": bx1, "y1": sp["y1"],
                            "oy": sp["oy"], "size": sp["size"], "text": num_tok, "used": False,
                        })
                        break
        # Anchor base row by largest-font span so small superscripts (e.g. x^{2} denominator) stay paired with their base
        if num_cands:
            max_nsz = max(s["size"] for s in num_cands)
            best_ny = max(s["oy"] for s in num_cands if s["size"] >= max_nsz - 0.5)
            num_cands = [s for s in num_cands if best_ny - 6.5 <= s["oy"] <= best_ny + 4.5]
        if den_cands:
            max_dsz = max(s["size"] for s in den_cands)
            best_dy = max(s["oy"] for s in den_cands if s["size"] >= max_dsz - 0.5)
            den_cands = [s for s in den_cands if best_dy - 6.5 <= s["oy"] <= best_dy + 4.5]
        if num_cands and den_cands:
            for sp in num_cands + den_cands:
                sp["used"] = True
            num_clean = attach_sub_sup(merge_same_baseline([dict(s, used=False) for s in num_cands]))
            den_clean = attach_sub_sup(merge_same_baseline([dict(s, used=False) for s in den_cands]))
            num_txt = " ".join(s["text"].strip() for s in sorted(num_clean, key=lambda x: x["x0"])).replace("$", "").strip()
            den_txt = " ".join(s["text"].strip() for s in sorted(den_clean, key=lambda x: x["x0"])).replace("$", "").strip()
            if num_txt and den_txt:
                est_oy = (by0 + by1) / 2.0 + 3.0
                frac_size = max(s["size"] for s in num_cands)
                # Keep small exponent fractions (e.g. x^{3/2}) at true superscript oy so attach_sub_sup catches them
                if bw < 13.0 and frac_size <= 8.5:
                    aligned_oy = est_oy
                else:
                    nearby_oys = [
                        s["oy"] for s in raw_spans
                        if not s["used"] and abs(s["oy"] - est_oy) <= 6.5 and s["size"] >= 9.5
                    ]
                    aligned_oy = sorted(nearby_oys)[len(nearby_oys) // 2] if nearby_oys else est_oy
                frac_sp = {
                    "x0": bx0,
                    "y0": min(s["y0"] for s in num_cands),
                    "x1": bx1,
                    "y1": max(s["y1"] for s in den_cands),
                    "oy": aligned_oy,
                    "size": frac_size if (bw < 13.0 and frac_size <= 8.5) else 11.5,
                    "text": f"$\\frac{{{num_txt}}}{{{den_txt}}}$",
                    "used": False,
                }
                if bw < 13.0 and frac_size <= 8.5:
                    # Feed small exponent fractions back into raw_spans so enclosing fraction bars (e.g. Ch7 Q10) can absorb them
                    raw_spans.append(frac_sp)
                else:
                    frac_spans.append(frac_sp)

    raw_spans = [s for s in raw_spans if not s["used"]] + frac_spans

    # 2. Merge same-baseline fragments (e.g. "The p"+"rincipal") & attach superscripts/subscripts
    raw_spans = merge_same_baseline(raw_spans)
    raw_spans = attach_sub_sup(raw_spans)

    # 3. Group spans sequentially by baseline `oy` (sorted strictly by oy first to avoid bucket jitter)
    raw_spans.sort(key=lambda s: (s["oy"], s["x0"]))
    rows = []
    for sp in raw_spans:
        row_tol = 7.5 if (rows and (sp["size"] >= 16.0 or any(rs["size"] >= 16.0 for rs in rows[-1]["spans"]))) else 5.0
        if not rows or abs(sp["oy"] - rows[-1]["oy"]) > row_tol:
            rows.append({"oy": sp["oy"], "y0": sp["y0"], "y1": sp["y1"], "spans": [sp]})
        else:
            rows[-1]["spans"].append(sp)
            rows[-1]["y0"] = min(rows[-1]["y0"], sp["y0"])
            rows[-1]["y1"] = max(rows[-1]["y1"], sp["y1"])

    lines = []
    for row in rows:
        row["spans"].sort(key=lambda s: s["x0"])
        parts = []
        prev_sp = None
        for sp in row["spans"]:
            t = sp["text"]
            if prev_sp is not None:
                gap = sp["x0"] - prev_sp["x1"]
                if sp["size"] <= 9.2 and prev_sp["size"] >= 10.5 and sp["oy"] < prev_sp["oy"] - 1.2 and gap < 8.0 and len(t.strip()) <= 5 and not re.search(r"(?:\([A-Da-d]\)|[A-Da-d][.)])$", prev_sp["text"].strip()):
                    if parts and re.search(r"\^\{[^{}]+\}$", parts[-1].rstrip()):
                        parts[-1] = parts[-1].rstrip()[:-1] + "^{" + t.strip() + "}}"
                    else:
                        parts.append(f"^{{{t.strip()}}}")
                    prev_sp = sp
                    continue
                if gap > 25.0 and not re.match(r"^(?:\([A-Da-d]\)|[A-Da-d][.)])", t.strip()):
                    parts.append("   ")
                elif gap > 1.2 and not (parts and parts[-1].endswith(" ")):
                    parts.append(" ")
            parts.append(t)
            prev_sp = sp

        full_row = "".join(parts).strip()
        if not full_row or HEADER_NOISE_RE.search(full_row):
            continue
        left_sp = [s for s in row["spans"] if s["x0"] < 245.0]
        right_sp = [s for s in row["spans"] if s["x0"] >= 245.0]
        has_left_opt = left_sp and re.match(r"^(?:\([A-Da-d]\)|[A-Da-d][.)])", left_sp[0]["text"].strip())
        has_right_table = right_sp and any(
            re.search(r"COLUMN|\([ivx]+\)|\([a-c]\)|\[[MLTA]", s["text"], re.I) for s in right_sp
        )
        if has_left_opt and has_right_table:
            l_txt = " ".join(s["text"].strip() for s in left_sp).strip()
            r_txt = " ".join(s["text"].strip() for s in right_sp).strip()
            if l_txt and not HEADER_NOISE_RE.search(l_txt):
                lines.append((row["oy"], left_sp[0]["x0"], left_sp[-1]["x1"], row["y1"], l_txt))
            if r_txt and not HEADER_NOISE_RE.search(r_txt):
                lines.append((row["oy"], right_sp[0]["x0"], right_sp[-1]["x1"], row["y1"], r_txt))
            continue

        x0 = row["spans"][0]["x0"]
        x1 = row["spans"][-1]["x1"]
        lines.append((row["oy"], x0, x1, row["y1"], full_row))

    return lines


def _is_valid_opt_match(text: str, m: re.Match) -> bool:
    """Filter unary-dash lookalikes, coordinate tuples, and 'both (a) and (b)' internal cross-references."""
    pos = m.start()
    if pos >= 2 and text[pos - 1] in (" ", "\t") and text[pos - 2] in ("\u2212", "\u2013", "\u2014", "-"):
        if pos == 2 or text[pos - 3] in (" ", "\t", "\n", "(", "="):
            return False
    before = text[max(0, pos - 16) : pos]
    after = text[m.end() : m.end() + 24]
    if re.search(r"(?:both|neither|either)\s+$", before, re.I):
        return False
    if re.search(r"\b(?:and|or)\s+$", before, re.I) and re.match(r"^\s*(?:$|[,.)]|\b(?:and|or|is|are)\b)", after, re.I):
        return False
    if re.match(r"\s*[-–]\s*\([ivx]+\)", after, re.I):
        return False
    return True


def _select_ascending_abcd(matches, text: str):
    """Find best (A, B, C, D) option markers after A (supports A,C,B,D grid order AND rejects trailing 'both (a) and (b)')."""
    by_char = {"A": [], "B": [], "C": [], "D": []}
    for m in matches:
        ch = m.group(1).upper()
        if ch == "IV":
            ch = "D"
        if ch in by_char:
            by_char[ch].append(m)
    a_cands = by_char["A"]
    if not a_cands:
        return None
    for ma in reversed(a_cands):
        # First prefer strictly ascending (A < B < C < D); otherwise allow grid-ordered (A < C < B < D) with first B,C,D after A
        mb_strict = next((m for m in by_char["B"] if m.start() > ma.end()), None)
        mc_strict = next((m for m in by_char["C"] if mb_strict and m.start() > mb_strict.end()), None)
        md_strict = next((m for m in by_char["D"] if mc_strict and m.start() > mc_strict.end()), None)
        if mb_strict and mc_strict and md_strict:
            return {"A": ma, "B": mb_strict, "C": mc_strict, "D": md_strict}
        mb = next((m for m in by_char["B"] if m.start() > ma.end()), None)
        mc = next((m for m in by_char["C"] if m.start() > ma.end()), None)
        md = next((m for m in by_char["D"] if m.start() > ma.end()), None)
        if mb and mc and md:
            return {"A": ma, "B": mb, "C": mc, "D": md}
    # Recover PDF duplicate-label typos (C),(C); b),b); d),d)
    ma = a_cands[-1]
    rem_b = [m for m in by_char["B"] if m.start() > ma.end()]
    rem_c = [m for m in by_char["C"] if m.start() > ma.end()]
    rem_d = [m for m in by_char["D"] if m.start() > ma.end()]
    if len(rem_c) >= 2 and rem_b and not rem_d and rem_b[0].start() < rem_c[-2].start():
        return {"A": ma, "B": rem_b[0], "C": rem_c[-2], "D": rem_c[-1]}
    if len(rem_b) >= 2 and not rem_c and rem_d and rem_b[-1].start() < rem_d[0].start():
        return {"A": ma, "B": rem_b[-2], "C": rem_b[-1], "D": rem_d[0]}
    if len(rem_d) >= 2 and rem_b and not rem_c and rem_b[0].start() < rem_d[-2].start():
        return {"A": ma, "B": rem_b[0], "C": rem_d[-2], "D": rem_d[-1]}
    return None


def _match_opt_candidates(cleaned_for_opts: str):
    """Find best 4-option sequence and return (stem, [A..D], kind) or None."""
    patterns = [
        ("upper_paren", re.compile(r"(?<![A-Z0-9(\u2212\u2013\u2014,-])\(([A-D])\)\s*")),
        ("lower_paren", re.compile(r"(?<![A-Za-z0-9(\u2212\u2013\u2014,-])\(([a-d])\)\s*")),
        ("upper_rparen", re.compile(r"(?<![A-Za-z0-9(\u2212\u2013\u2014,-])([A-D])\)\s*")),
        ("lower_rparen", re.compile(r"(?<![A-Za-z0-9(\u2212\u2013\u2014,-])([a-d])\)\s*")),
        ("upper_dot", re.compile(r"(?<![A-Za-z0-9(\u2212\u2013\u2014,-])([A-D])\.\s+")),
        ("lower_dot", re.compile(r"(?<![A-Za-z0-9(\u2212\u2013\u2014,-])([a-d])\.(?:\s+|(?=[A-Z0-9]))")),
        # Fallback for mixed-case / mixed-paren typos like Chem U9 Q74 (a, b, C, d), U4 Q70 (a..D.), U10 Q30 (c)..(d))
        ("mixed_rparen", re.compile(r"(?:^|\s)\(?([A-Da-d])\)\s*")),
        ("mixed_dot", re.compile(r"(?:^|\s)([A-Da-d])\.(?:\s+|(?=[A-Z0-9]))")),
    ]
    best_candidate = None
    best_at_boundary = False
    for kind, pat in patterns:
        raw_matches = [m for m in pat.finditer(cleaned_for_opts) if _is_valid_opt_match(cleaned_for_opts, m)]
        if kind == "lower_rparen" and len(raw_matches) == 3:
            # Handle Chem U6 Q38 typo: a) ... b) ... c) ... iv) ...
            iv_m = re.search(r"(?:^|\n|\s{2,})(iv)\)\s*", cleaned_for_opts, re.I)
            if iv_m:
                raw_matches.append(iv_m)
                raw_matches.sort(key=lambda m: m.start())
        if len(raw_matches) < 4:
            continue
        by_letter = _select_ascending_abcd(raw_matches, cleaned_for_opts)
        if not by_letter:
            continue
        pos_to_slot = {by_letter[k].start(): idx for idx, k in enumerate(("A", "B", "C", "D"))}
        ordered = sorted((by_letter["A"], by_letter["B"], by_letter["C"], by_letter["D"]), key=lambda m: m.start())
        if kind.startswith("mixed_") and best_candidate is not None:
            continue
        all_boundary = all(
            (
                m.start() == 0
                or cleaned_for_opts[m.start() - 1] == "\n"
                or (m.start() >= 2 and cleaned_for_opts[m.start() - 2 : m.start()] in ("  ", "\n "))
                or (kind.startswith("mixed_") and m.group(0)[0].isspace())
            )
            and not re.match(r"\s*[-–]\s*\([ivx]+\)", cleaned_for_opts[m.end() :], re.I)
            for m in ordered
        )
        if kind.startswith("mixed_") and ordered[0].group(0)[0].isspace():
            stem_end = ordered[0].start() + 1
        else:
            stem_end = ordered[0].start()
        if (
            best_candidate is None
            or (all_boundary and not best_at_boundary)
            or (stem_end > best_candidate[0] and (all_boundary or not best_at_boundary))
        ):
            stem = cleaned_for_opts[:stem_end].strip()
            opts_slots = ["", "", "", ""]
            for i, m in enumerate(ordered):
                if i + 1 < len(ordered):
                    nxt = ordered[i + 1]
                    end_pos = nxt.start() + (1 if kind.startswith("mixed_") and nxt.group(0)[0].isspace() else 0)
                else:
                    end_pos = len(cleaned_for_opts)
                slot_idx = pos_to_slot[m.start()]
                opts_slots[slot_idx] = clean_text(cleaned_for_opts[m.end() : end_pos])
            best_candidate = (stem_end, stem, opts_slots, kind)
            best_at_boundary = all_boundary

    if best_candidate:
        return best_candidate[1], best_candidate[2], best_candidate[3]
    return None


def _strip_trailing_diff_tag(block_text: str) -> str:
    # NEVER use flags=re.I here because lowercase '(a)' / '(d)' in '(i)-(a)' would be deleted!
    return re.sub(r"[ \t]*\((?:[Ee]asy|[Aa]verage|[Dd]ifficult|[EADH])\)[ \t]*(?=\n|$)", "", block_text)


def parse_mcq_options(block_text: str):
    """
    Parse options (A)/(B)/(C)/(D) or a)/b)/c)/d) or A)/B)/C)/D) from a question block.
    Returns (stem, [optA, optB, optC, optD]) or None if not a 4-option MCQ.
    """
    res = _match_opt_candidates(_strip_trailing_diff_tag(block_text))
    if res:
        return res[0], res[1]
    return None


def parse_mcq_options_with_kind(block_text: str):
    return _match_opt_candidates(_strip_trailing_diff_tag(block_text))


def has_garbled_math(s: str) -> bool:
    if not s:
        return False
    if PUA_RE.search(s):
        return True
    # Detect stacked fractions: 3+ consecutive very short lines (1-4 chars)
    lines = [l.strip() for l in s.splitlines() if l.strip()]
    short_run = 0
    for l in lines:
        if len(l) <= 4 and not re.fullmatch(r"\(?[A-Da-d]\)?\.?", l):
            short_run += 1
            if short_run >= 3:
                return True
        else:
            short_run = 0
    return False


def strip_garbled_lines(s: str) -> str:
    kept = []
    for l in s.splitlines():
        ls = l.strip()
        if not ls:
            continue
        if PUA_RE.search(ls):
            continue
        if len(ls) <= 3 and re.fullmatch(r"[0-9rxyzmnijk+\-=/]+", ls):
            continue
        kept.append(ls)
    out = clean_text("\n".join(kept))
    return out if out else "Refer to the question figure below:"


def page_has_vector_diagram(page: pymupdf.Page, y0: float, y1: float) -> bool:
    for d in page.get_drawings():
        r = d.get("rect")
        if not r:
            continue
        if r.y1 >= y0 - 4 and r.y0 <= y1 + 4:
            if (r.y1 - r.y0) > 15 and (r.x1 - r.x0) > 15:
                return True
    return False


def find_drawn_table_bbox(page: pymupdf.Page, y0: float, y1: float):
    """Detect a drawn table grid (borders/cells) inside [y0, y1] and return its union bbox."""
    rects = []
    for d in page.get_drawings():
        r = d.get("rect")
        if not r:
            continue
        w = r.x1 - r.x0
        h = r.y1 - r.y0
        # Ignore full-page border rectangles, header bars, or wide frames
        if h > 320 or w > 500 or (w > 480 and h > 220) or r.y0 < 56.0:
            continue
        if r.y1 >= y0 - 2 and r.y0 <= y1 + 2:
            # Table borders: horizontal lines >= 25pt or vertical lines/cells >= 10pt high
            if (w >= 25 and h <= 3) or (h >= 10 and w <= 3) or (w >= 25 and h >= 10):
                rects.append(r)
    if len(rects) >= 4:
        tx0 = min(r.x0 for r in rects)
        ty0 = min(r.y0 for r in rects)
        tx1 = max(r.x1 for r in rects)
        ty1 = max(r.y1 for r in rects)
        if 120 <= (tx1 - tx0) <= 520 and 25 <= (ty1 - ty0) <= 320:
            return (tx0, ty0, tx1, ty1)
    return None


def _opt_pat_for_kind(opt_kind: str | None):
    if opt_kind in ("lower_dot", "mixed_dot"):
        return re.compile(r"^[a-dA-D]\.\s+")
    if opt_kind == "lower_paren":
        return re.compile(r"^\([a-d]\)")
    if opt_kind in ("lower_rparen", "mixed_rparen"):
        return re.compile(r"^[a-dA-D]\)")
    if opt_kind == "upper_dot":
        return re.compile(r"^[A-D]\.\s+")
    return re.compile(r"^(?:\(([A-Da-d])\)|([A-Da-d])[.)])\s*")


def crop_option_boxes(doc_page: pymupdf.Page, opt_y0: float, opt_y1: float, out_prefix: Path, opt_kind: str | None):
    """Find (A)/(B)/(C)/(D) markers inside [opt_y0, opt_y1] and crop each option cleanly."""
    d = doc_page.get_text("dict")
    pat = re.compile(r"^\(?([A-Da-d])[\)\.]\s*$")
    pat_prefix = re.compile(r"^\(?([A-Da-d])[\)\.]")
    if opt_kind in ("lower_dot", "lower_rparen", "lower_paren"):
        pat = re.compile(r"^\(?([a-d])[\)\.]\s*$")
        pat_prefix = re.compile(r"^\(?([a-d])[\)\.]")
    elif opt_kind in ("upper_paren", "upper_rparen", "upper_dot"):
        pat = re.compile(r"^\(?([A-D])[\)\.]\s*$")
        pat_prefix = re.compile(r"^\(?([A-D])[\)\.]")
    markers = {}
    for b in d.get("blocks", []):
        if b.get("type") != 0:
            continue
        for l in b.get("lines", []):
            for sp in l.get("spans", []):
                oy = sp.get("origin", (0, sp["bbox"][3]))[1]
                if oy < opt_y0 - 10.0 or oy > opt_y1:
                    continue
                t = decode_pua(sp.get("text", "")).strip()
                m = pat.match(t)
                if not m:
                    m2 = pat_prefix.match(t)
                    if m2 and sp["bbox"][0] < 380:
                        m = m2
                if m:
                    ch = m.group(1).upper()
                    markers.setdefault(ch, []).append((sp["bbox"][0], sp["bbox"][2], oy))
    if not all(k in markers for k in ("A", "B", "C", "D")):
        return None
    chosen = {k: markers[k][-1] for k in ("A", "B", "C", "D")}
    pts = [(k, *chosen[k]) for k in ("A", "B", "C", "D")]
    out_urls = []
    for ch in ("A", "B", "C", "D"):
        _, mx0, mx1, moy = next(p for p in pts if p[0] == ch)
        same_row_right = [p[1] for p in pts if p[0] != ch and abs(p[3] - moy) <= 18.0 and p[1] > mx0 + 10.0]
        below_rows = [p[3] for p in pts if p[3] > moy + 18.0]
        bx0 = mx1 + 1.0
        bx1 = min(same_row_right) - 8.0 if same_row_right else 558.0
        by0 = max(opt_y0, moy - 24.0)
        by1 = (min(below_rows) - 20.0) if below_rows else opt_y1
        if bx1 - bx0 < 14.0 or by1 - by0 < 10.0:
            return None
        u = crop_bbox(
            doc_page,
            (bx0, by0, bx1, by1),
            out_prefix.parent / f"{out_prefix.name}_opt{ord(ch)-64}.png",
            pad=2,
            min_y=opt_y0,
            max_y=opt_y1,
        )
        if not u:
            return None
        out_urls.append(u)
    return out_urls if len(out_urls) == 4 else None


def resolve_visuals(
    doc: pymupdf.Document,
    subj: str,
    cnum: int,
    qnum: int,
    stem: str,
    opts,
    spans,
    existing_imgs,
    opt_kind: str | None = None,
    next_q_y: float | None = None,
    full_raw: str = "",
):
    """
    Attach imageUrl / optionImages cleanly:
    - Case 1: 4 option-diagram images -> optionImages[0..3].
    - Case 2: Side-by-side Match-the-Following table -> table image + clean left options.
    - Case 2b: Drawn/tabular Match-the-Following inside stem -> non-clipped full table image.
    - Case 3: Genuine embedded raster diagram(s) or vector diagrams (reactions, graphs, circuits).
    - Case 4: 2D Math (Matrices, Determinants, Piecewise) or failed/garbled options ->
      strictly bounded by next_q_y - 8 so next question never leaks in!
    """
    img_url = None
    option_images = None

    # Case 1: 4 separate diagram images for options (A)-(D)
    if existing_imgs and len(existing_imgs) == 4 and opts and all("See figure" in o for o in opts):
        sorted_imgs = sorted(existing_imgs, key=lambda item: (item[0], round(item[1][1] / 35.0), item[1][0]))
        option_images = []
        for idx_i, (pno, ib) in enumerate(sorted_imgs):
            oimg = crop_bbox(doc[pno], ib, OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}_opt{idx_i+1}.png")
            option_images.append(oimg or None)
        if any(option_images):
            opts = ["", "", "", ""]
            stem = re.sub(r"(\([A-D]\)\s*){2,}", "", stem).strip()
        else:
            option_images = None
        return stem, opts, None, option_images

    main_pno = spans[0][0] if spans else (existing_imgs[0][0] if existing_imgs else None)
    same_page = [sp for sp in spans if sp[0] == main_pno] if (spans and main_pno is not None) else []
    first_q_oy = same_page[0][1] if same_page else 68.0
    last_oy = max(sp[1] for sp in same_page) if same_page else first_q_oy + 30.0
    qy0 = max(56.0, first_q_oy - 12.0) if same_page else 56.0
    qy1_limit = (next_q_y - 11.5) if (next_q_y and next_q_y < 9000) else 782.0

    # Compute exact visual top/bottom boundaries on main_pno (guarding Cambria Math phantom bboxes)
    opt_row_top = None
    next_q_top = qy1_limit
    prev_q_bot = 55.0
    draw_max_y = 0.0
    if same_page and main_pno is not None:
        d_p = doc[main_pno].get_text("dict")
        opt_pat = _opt_pat_for_kind(opt_kind)
        first_opt_oy = next((sp[1] for sp in same_page if opt_pat.match(sp[5].strip())), None)

        def _vis_y0(sp_d, soy):
            bh = sp_d["bbox"][3] - sp_d["bbox"][1]
            return soy - sp_d.get("size", 11.0) * 1.05 if bh >= 22.0 else sp_d["bbox"][1]

        def _vis_y1(sp_d, soy):
            bh = sp_d["bbox"][3] - sp_d["bbox"][1]
            return soy + sp_d.get("size", 11.0) * 0.35 if bh >= 22.0 else sp_d["bbox"][3]

        prev_bots = []
        opt_tops = []
        next_tops = []
        for b in d_p.get("blocks", []):
            if b.get("type") != 0:
                continue
            for l in b.get("lines", []):
                for sp_d in l.get("spans", []):
                    st_raw = decode_pua(sp_d.get("text", "")).strip()
                    if not st_raw:
                        continue
                    soy = sp_d.get("origin", (0, sp_d["bbox"][3]))[1]
                    if soy < 53.0:
                        continue
                    vy0 = _vis_y0(sp_d, soy)
                    vy1 = _vis_y1(sp_d, soy)
                    if first_q_oy - 32.0 <= soy <= first_q_oy - 8.0:
                        prev_bots.append(vy1)
                    if first_opt_oy is not None and first_q_oy + 6.0 <= soy <= first_opt_oy + 5.0 and soy >= first_opt_oy - 22.0:
                        # Include matrix/fraction rows above first_opt_oy only if below stem text (has letters >1 char before first_opt_oy)
                        stem_word_oys = [sp[1] for sp in same_page if sp[1] < first_opt_oy - 12.0 and re.search(r"[A-Za-z]{2,}", sp[5])]
                        stem_floor = (max(stem_word_oys) + 5.5) if stem_word_oys else (first_opt_oy - 15.0)
                        if soy >= max(stem_floor, first_opt_oy - 22.0) or abs(soy - first_opt_oy) <= 6.0:
                            opt_tops.append(vy0)
                    if next_q_y and next_q_y < 9000 and next_q_y - 12.0 <= soy <= next_q_y + 5.0:
                        next_tops.append(vy0)
        if prev_bots:
            prev_q_bot = max(prev_q_bot, max(prev_bots) + 1.5)
        if opt_tops:
            opt_row_top = min(opt_tops) - 1.5
        if next_tops:
            next_q_top = min(qy1_limit, min(next_tops) - 1.5)
        qy0 = max(qy0, prev_q_bot)
        qy1_limit = min(qy1_limit, next_q_top)
        for dr in doc[main_pno].get_drawings():
            r = dr.get("rect")
            if r and r.y0 >= qy0 - 2.0 and r.y1 <= qy1_limit and (r.y1 - r.y0) <= 320.0 and not (r.x0 < 26.0 and (r.y1 - r.y0) > 200.0):
                draw_max_y = max(draw_max_y, r.y1)
    else:
        opt_pat = _opt_pat_for_kind(opt_kind)
        first_opt_oy = next((sp[1] for sp in same_page if opt_pat.match(sp[5].strip())), None)

    same_page_img_bot = max((ib[3] for p, ib in (existing_imgs or []) if p == main_pno and ib[3] <= qy1_limit + 4.0), default=0.0)
    qy1 = min(max(last_oy + 10.0, same_page_img_bot + 2.0, draw_max_y + 2.0, qy0 + 24.0), qy1_limit)

    # Case 2: Side-by-side Match-the-Following table (COLUMN I / COLUMN II at x >= 245 next to (A)-(D))
    if same_page and ("COLUMN" in (stem + " " + " ".join(opts or []) + " " + full_raw).upper()):
        right_spans = [sp for sp in same_page if sp[2] >= 245]
        left_spans = [sp for sp in same_page if sp[2] < 245]
        if len(right_spans) >= 4 and len(left_spans) >= 4:
            ty0 = min(sp[1] for sp in right_spans) - 6
            ty1 = min(max(sp[1] for sp in right_spans) + 12, qy1_limit)
            tx0 = min(sp[2] for sp in right_spans) - 8
            tx1 = min(565.0, max(sp[3] for sp in right_spans) + 12)
            img_url = crop_bbox(doc[main_pno], (tx0, ty0, tx1, ty1), OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}_table.png") or None
            left_text = "\n".join(sp[5] for sp in left_spans)
            reparsed = parse_mcq_options_with_kind(left_text)
            if reparsed:
                stem_l, opts_l, _ = reparsed
                stem_l, _ = strip_difficulty(stem_l)
                stem_l = re.sub(r"^\d+[.)](?!\d)\s*", "", stem_l).strip()
                opts = [strip_difficulty(o)[0] for o in opts_l]
                stem = clean_text(stem_l)
            return stem, opts, img_url, None

    # Case 2b: Drawn table inside stem ONLY for Match-the-Following / Column questions
    is_match_table = bool(re.search(r"match|column|list\s*[-–]?\s*[i12]|colligative|type of", stem, re.I))
    if same_page and not existing_imgs and is_match_table:
        pages_in_q = sorted({sp[0] for sp in spans})
        table_crops = []
        first_tbox_y = None
        first_tbox_pno = None
        for p_idx in pages_in_q:
            p_spans = [sp for sp in spans if sp[0] == p_idx]
            p_limit = qy1_limit if p_idx == main_pno else 782.0
            opt_y_here = next((sp[1] for sp in p_spans if opt_pat.match(sp[5].strip())), min(p_spans[-1][1] + 14.0, p_limit))
            sy0 = p_spans[0][1] - 4.0
            tbox = find_drawn_table_bbox(doc[p_idx], sy0, opt_y_here - 2.0)
            if tbox:
                if first_tbox_y is None:
                    first_tbox_y = tbox[1]
                    first_tbox_pno = p_idx
                rect = pymupdf.Rect(tbox) + (-4, -4, 4, 4)
                rect = rect & doc[p_idx].rect
                if rect.width >= 8 and rect.height >= 8:
                    table_crops.append(doc[p_idx].get_pixmap(matrix=pymupdf.Matrix(2.5, 2.5), clip=rect))
        if table_crops:
            out_path = OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}_table.png"
            out_path.parent.mkdir(parents=True, exist_ok=True)
            if len(table_crops) == 1:
                table_crops[0].save(str(out_path))
            else:
                max_w = max(px.width for px in table_crops)
                tot_h = sum(px.height for px in table_crops)
                merged_pix = pymupdf.Pixmap(table_crops[0].colorspace, pymupdf.IRect(0, 0, max_w, tot_h), table_crops[0].alpha)
                merged_pix.clear_with(255)
                y_off = 0
                for px in table_crops:
                    px.set_origin(0, y_off)
                    merged_pix.copy(px, px.irect)
                    y_off += px.height
                merged_pix.save(str(out_path))
            img_url = "/" + out_path.relative_to(ROOT / "public").as_posix()
            intro_lines = []
            for sp in spans:
                if sp[0] == first_tbox_pno and sp[1] < first_tbox_y - 2:
                    txt_clean = re.sub(r"^\d+[.)](?!\d)\s*", "", sp[5]).strip()
                    txt_clean, _ = strip_difficulty(txt_clean)
                    if txt_clean:
                        intro_lines.append(txt_clean)
            if intro_lines:
                stem = clean_text("\n".join(intro_lines))
            if opts and not any(not o.strip() for o in opts):
                return stem, opts, img_url, None

    # Case 3: Genuine embedded raster diagram(s)
    if existing_imgs:
        img_pno = existing_imgs[0][0]
        same_page_imgs = [ib for p, ib in existing_imgs if p == img_pno]
        if len(same_page_imgs) == 1:
            union_box = same_page_imgs[0]
        else:
            union_box = (
                min(b[0] for b in same_page_imgs),
                min(b[1] for b in same_page_imgs),
                max(b[2] for b in same_page_imgs),
                max(b[3] for b in same_page_imgs),
            )
        img_url = crop_bbox(doc[img_pno], union_box, OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}.png") or None

    # Case 3b: Vector-drawn diagram (Chemistry organic reactions, Physics graphs/circuits, Maths vector figures)
    VISUAL_STEM_RE = re.compile(
        r"\b(following figure|given figure|figure given|shown below|given below|following graph|diagram|circuit|following reaction|following conversion|compound shown|reaction sequence|potential energy variation|intermediate\s*[‘'\"]?A|product\s*[‘'\"]?[A-Z]|weakest acid)\b",
        re.I,
    )
    if not img_url and same_page and main_pno is not None:
        stem_end_y = (first_opt_oy - 4.0) if (first_opt_oy and opts and not any(not o.strip() for o in opts)) else qy1
        vbox = find_vector_diagram_bbox(doc[main_pno], qy0, stem_end_y)
        if vbox and (VISUAL_STEM_RE.search(stem) or not opts or has_garbled_math(stem)):
            img_url = crop_bbox(doc[main_pno], vbox, OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}.png", pad=6) or None

    # Case 4: 2D Math (ONLY Mathematics Matrices, Determinants, Piecewise) OR unparsed/empty options
    has_empty_opt = bool(opts and any(not o.strip() for o in opts))
    qy0_2d = max(qy0, first_q_oy - 6.0) if same_page else qy0
    is_2d_page = (subj == "mathematics") and bool(same_page) and (main_pno is not None) and detect_2d_math_in_range(doc[main_pno], qy0_2d, qy1)
    needs_option_fallback = (opts is None) or has_empty_opt

    def _clean_intro_line() -> str:
        if not same_page:
            return f"Solve Question {qnum} shown below:"
        qline = next((sp[5] for sp in same_page if re.match(r"^\d+[.)](?!\d)\s*", sp[5])), same_page[0][5])
        if not re.match(r"^\d+[.)](?!\d)\s*", qline):
            return f"Solve Question {qnum} shown below:"
        intro_t = re.sub(r"^\d+[.)](?!\d)\s*", "", qline).strip()
        intro_t, _ = strip_difficulty(intro_t)
        if "|" in intro_t or "[" in intro_t or len(intro_t) < 12 or has_garbled_math(intro_t):
            return f"Solve Question {qnum} shown below:"
        return clean_text(intro_t)

    if same_page and main_pno is not None and (is_2d_page or needs_option_fallback):
        stem_end_limit = (first_opt_oy - 8.0) if first_opt_oy else qy1
        if first_opt_oy and opt_row_top is not None:
            stem_end_limit = min(stem_end_limit, max(qy0 + 16.0, opt_row_top))
        elif first_opt_oy:
            stem_end_limit = max(qy0 + 16.0, first_opt_oy - 14.0)
        stem_is_2d = (subj == "mathematics") and detect_2d_math_in_range(doc[main_pno], qy0_2d, stem_end_limit)
        opt_2d_y0 = (
            max(qy0_2d, min(first_opt_oy - 10.0, (opt_row_top - 2.0) if opt_row_top is not None else first_opt_oy - 10.0))
            if first_opt_oy is not None
            else qy0_2d
        )
        opts_are_2d = (
            subj == "mathematics"
            and first_opt_oy is not None
            and detect_2d_math_in_range(doc[main_pno], opt_2d_y0, qy1)
        ) or needs_option_fallback

        # If ONLY the stem has a 2D matrix/determinant/piecewise and options (A)-(D) parsed cleanly:
        if stem_is_2d and not opts_are_2d and first_opt_oy and not needs_option_fallback:
            stem_img = crop_bbox(
                doc[main_pno],
                (32.0, qy0, 560.0, max(qy0 + 16.0, stem_end_limit)),
                OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}.png",
                pad=2,
                min_y=prev_q_bot,
                max_y=stem_end_limit,
            )
            if stem_img:
                img_url = stem_img
                stem = _clean_intro_line()
                return stem, opts, img_url, None

        # If options themselves contain 2D matrices/structures or failed to parse cleanly:
        if opts_are_2d or needs_option_fallback:
            opt_box_floor = (
                max(qy0 + 14.0, stem_end_limit + 1.5)
                if (first_opt_oy and stem_end_limit and stem_end_limit < first_opt_oy)
                else max(qy0 + 14.0, (first_opt_oy - 20.0) if first_opt_oy else qy0)
            )
            opt_has_vec = (
                subj != "mathematics"
                and first_opt_oy is not None
                and find_vector_diagram_bbox(doc[main_pno], (first_opt_oy - 26.0), qy1) is not None
            )
            if first_opt_oy and not opt_has_vec:
                opt_crops = crop_option_boxes(
                    doc[main_pno], opt_box_floor, min(qy1, next_q_top), OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}", opt_kind
                )
            else:
                opt_crops = None

            if opt_crops:
                if stem_is_2d or has_garbled_math(stem) or (img_url is None and VISUAL_STEM_RE.search(stem)):
                    s_img = crop_bbox(
                        doc[main_pno],
                        (32.0, qy0, 560.0, max(qy0 + 16.0, stem_end_limit)),
                        OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}.png",
                        pad=2,
                        min_y=prev_q_bot,
                        max_y=stem_end_limit,
                    )
                    if s_img:
                        img_url = s_img
                        stem = _clean_intro_line()
                else:
                    cutoff_y = min(opt_row_top, first_opt_oy - 4.0) if (opt_row_top is not None and first_opt_oy is not None) else (opt_2d_y0 if first_opt_oy is not None else qy1)
                    stem_only_lines = []
                    for sp in spans:
                        if sp[0] == main_pno and sp[1] < cutoff_y - 0.5:
                            t_line = re.sub(r"^\d+[.)](?!\d)\s*", "", sp[5]).strip()
                            t_line, _ = strip_difficulty(t_line)
                            if t_line and not opt_pat.match(t_line):
                                stem_only_lines.append(t_line)
                    if stem_only_lines and not any("Statement" in l for l in stem_only_lines):
                        cand_stem = clean_text("\n".join(stem_only_lines))
                        if cand_stem and not has_garbled_math(cand_stem):
                            stem = cand_stem
                return stem, ["", "", "", ""], img_url, opt_crops

            # Clean strictly-clamped single-question fallback (impossible to bleed prev/next question)
            full_img = crop_bbox(
                doc[main_pno],
                (32.0, qy0, 560.0, qy1),
                OUT_IMG_DIR / subj / f"ch{cnum}_q{qnum}_full.png",
                pad=2,
                min_y=prev_q_bot,
                max_y=qy1_limit,
            )
            if full_img:
                img_url = full_img
                stem = _clean_intro_line()
                opts = ["Option (A) — See figure", "Option (B) — See figure", "Option (C) — See figure", "Option (D) — See figure"]

    return stem, opts, img_url, option_images


def parse_physics(doc: pymupdf.Document, chapters):
    """
    Physics PDF has per-chapter sections:
      CHAPTER N. NAME
      MULTIPLE CHOICE QUESTIONS
      ...
      FILL IN THE BLANKS
      SET-1 ...
      ANSWER KEYS TO MULTIPLE CHOICE QUESTIONS
      ...
      ANSWER TO FIBs
      SET-1 ...
      TWO MARKS QUESTIONS ...
    """
    # Map chapter start pages
    chap_starts = {}
    for pno in range(len(doc)):
        txt = doc[pno].get_text("text")
        m = re.search(r"CHAPTER\s*[-–:]?\s*0*(\d+)\b", txt, re.I)
        if m and re.search(r"MULTIPLE\s+CHOICE", txt, re.I):
            cnum = int(m.group(1))
            if cnum not in chap_starts:
                chap_starts[cnum] = pno

    sorted_chaps = sorted(chap_starts.items(), key=lambda x: x[1])
    chap_ranges = {}
    for idx, (cnum, start_p) in enumerate(sorted_chaps):
        end_p = sorted_chaps[idx + 1][1] if idx + 1 < len(sorted_chaps) else len(doc)
        chap_ranges[cnum] = (start_p, end_p)

    results = []
    for cnum, cname in chapters:
        if cnum not in chap_ranges:
            continue
        start_p, end_p = chap_ranges[cnum]
        section_end = end_p

        # Collect lines & images across [start_p, section_end)
        mcq_answers = {}
        fib_answers = {}
        mode = None
        current_q_num = None
        current_q_lines = []
        current_q_imgs = []
        current_q_spans = []
        current_q_next_y = 9999
        raw_mcqs = []
        raw_fibs = []
        current_set = 1
        current_word_bank = []
        in_ans_mcq = False
        in_ans_fib = False
        ans_fib_set = 1
        pending_mcq_num = None

        def flush_q():
            nonlocal current_q_num, current_q_lines, current_q_imgs, current_q_spans, current_q_next_y
            if current_q_num is None or not current_q_lines:
                current_q_num = None
                current_q_lines = []
                current_q_imgs = []
                current_q_spans = []
                current_q_next_y = 9999
                return
            full = "\n".join(current_q_lines)
            if mode == "mcq":
                parsed = parse_mcq_options_with_kind(full)
                if parsed:
                    stem, opts, opt_kind = parsed
                    _, diff = strip_difficulty(full)
                    stem, _ = strip_difficulty(stem)
                    opts = [strip_difficulty(o)[0] for o in opts]
                    raw_mcqs.append({
                        "qnum": current_q_num,
                        "stem": clean_text(stem),
                        "options": opts,
                        "opt_kind": opt_kind,
                        "next_y": current_q_next_y,
                        "full_raw": full,
                        "difficulty": diff,
                        "imgs": list(current_q_imgs),
                        "spans": list(current_q_spans),
                    })
                elif current_q_imgs or (current_q_spans and current_q_num in mcq_answers):
                    stem, diff = strip_difficulty(full)
                    raw_mcqs.append({
                        "qnum": current_q_num,
                        "stem": clean_text(stem),
                        "options": None,
                        "opt_kind": None,
                        "next_y": current_q_next_y,
                        "full_raw": full,
                        "difficulty": diff,
                        "imgs": list(current_q_imgs),
                        "spans": list(current_q_spans),
                    })
            elif mode == "fib":
                stem, diff = strip_difficulty(full)
                raw_fibs.append({
                    "qnum": current_q_num,
                    "setNumber": current_set,
                    "wordBank": list(current_word_bank),
                    "stem": clean_text(stem),
                    "difficulty": diff,
                    "spans": list(current_q_spans),
                })
            current_q_num = None
            current_q_lines = []
            current_q_imgs = []
            current_q_spans = []
            current_q_next_y = 9999

        for pno in range(start_p, section_end):
            page = doc[pno]
            page_txt = page.get_text("text")
            if re.search(r"MODEL\s+QUESTION\s+PAPER|BLUE\s+PRINT", page_txt, re.I):
                flush_q()
                mode = "done"
                break

            if re.search(r"ANSWER\s*KEYS?\s*(?:TO|FOR)?\s*MULTIPLE\s+CHOICE|KEY\s+ANSWERS\s+(?:FOR|TO)\s+MULTIPLE\s+CHOICE|ANSWERS?\s+TO\s+(?:FIBs?|FILL\s+IN\s+THE\s+BLANKS)|^\s*ANSWERS\s*$", page_txt, re.I | re.M):
                flush_q()
                # Extract FIB answers wherever "1. word" appears after FIB header
                fib_hdr = re.search(r"(?:ANSWERS?\s+TO\s+(?:FIBs?|FILL\s+IN\s+THE\s+BLANKS)|ANSWER\s+TO\s+FIBs?|^\s*FILL\s+IN\s+THE\s+BLANKS\s*$)([\s\S]*)", page_txt, re.I | re.M)
                if fib_hdr:
                    flat_fib = re.sub(r"\s+", " ", fib_hdr.group(1))
                    for m in re.finditer(r"(\d+)\.\s*([A-Za-z0-9\-\+\/\.\(\)\sπ]+?)(?=,\s*\d+\.|\s+\d+\.|\s+SET\s*[-–]?\s*\d+|\s+\d+\s+[A-D]\b|$)", flat_fib):
                        val = m.group(2).strip().rstrip(".,")
                        if val and not re.fullmatch(r"[A-D]", val):
                            fib_answers[int(m.group(1))] = val

                # Extract MCQ answers:
                # 1) Visual row-wise tables ("1 2 3 4 5" row followed by "D A C D B" row, or "Q. No 1 2..." / "Ans C D...")
                vis_rows = [re.sub(r"^(Q\.?\s*No\.?|Ans\.?)\s*", "", r[4].strip(), flags=re.I) for r in extract_lines_with_y(page, detect_fractions=False)]
                for li in range(len(vis_rows) - 1):
                    r1 = vis_rows[li].split()
                    r2 = vis_rows[li + 1].split()
                    if r1 and r2 and len(r1) == len(r2) and all(re.fullmatch(r"\d{1,3}", t) for t in r1) and all(re.fullmatch(r"\(?[A-D]\)?", t) for t in r2):
                        for qn_s, ans_s in zip(r1, r2):
                            mcq_answers[int(qn_s)] = ord(ans_s.strip("()")) - ord("A")

                # 2) Column/pair format ("1 B" or "1 (B)" or "1. B")
                flat_all = re.sub(r"\s+", " ", page_txt)
                for m in re.finditer(r"\b(\d{1,3})\s*(?:[.)]\s*)?\(?([A-D])\)?(?=\s|$)", flat_all):
                    qn = int(m.group(1))
                    if 1 <= qn <= 150 and qn not in mcq_answers:
                        mcq_answers[qn] = ord(m.group(2)) - ord("A")
                mode = "ans_mcq"
                if re.search(r"TWO\s+MARKS?\s+QUESTIONS|2\s+MARKS?\s+QUESTIONS|\bPART\s*[-–]?\s*B\b", page_txt, re.I):
                    mode = "done"
                continue

            lines = extract_lines_with_y(page)
            page_imgs = get_page_images(page)

            # Group lines by vertical position to associate images
            for idx_l, (y0, x0, x1, y1, txt) in enumerate(lines):
                if re.search(r"TWO\s+MARKS?\s+QUESTIONS|2\s+MARKS?\s+QUESTIONS|THREE\s+MARKS|FIVE\s+MARKS|\bPART\s*[-–]?\s*B\b", txt, re.I):
                    flush_q()
                    mode = "done"
                    continue
                if re.search(r"MULTIPLE\s+CHOICE\s+QUESTIONS", txt, re.I):
                    flush_q()
                    mode = "mcq"
                    continue
                if re.search(r"FILL\s+IN\s+THE\s+BLANKS", txt, re.I):
                    flush_q()
                    mode = "fib"
                    continue

                if mode in ("done", "ans_mcq", "ans_fib", None):
                    continue

                if mode == "fib":
                    sm = re.match(r"SET\s*[-–]?\s*(\d+)", txt, re.I)
                    if sm:
                        flush_q()
                        current_set = int(sm.group(1))
                        # Check if word bank is on same line
                        wb = re.search(r"[\[\(]([^\]\)]+)[\]\)]", txt)
                        if wb:
                            current_word_bank = [w.strip() for w in wb.group(1).split(",") if w.strip()]
                        continue
                    if txt.startswith("[") and "]" in txt and not re.match(r"^\d+\.", txt):
                        wb = txt[1 : txt.index("]")]
                        current_word_bank = [w.strip() for w in wb.split(",") if w.strip()]
                        continue

                # Check if new question starts: "1. ..." (excluding decimal headers 1.1)
                qm = re.match(r"^(\d+)[.)](?!\d)\s*(.*)$", txt)
                if qm and x0 < 95:
                    flush_q()
                    current_q_num = int(qm.group(1))
                    current_q_spans.append((pno, y0, x0, x1, y1, txt))
                    rest = qm.group(2).strip()
                    if rest:
                        current_q_lines.append(rest)
                    # Find next question's or section header's y0 on this page to bound images strictly
                    next_y = 9999
                    for ny0, nx0, _, _, ntxt in lines[idx_l + 1 :]:
                        if re.search(r"FILL\s+IN\s+THE\s+BLANKS|TWO\s+MARKS|2\s+MARKS|THREE\s+MARKS|ANSWER", ntxt, re.I):
                            next_y = ny0
                            break
                        if nx0 < 95 and re.match(r"^\d+[.)](?!\d)\s*", ntxt):
                            next_y = ny0
                            break
                    current_q_next_y = next_y
                    for ib in page_imgs:
                        ymid = (ib[1] + ib[3]) / 2.0
                        if y0 - 16.0 <= ymid <= next_y - 2.0 and ib[1] <= next_y - 4.0:
                            current_q_imgs.append((pno, ib))
                else:
                    if current_q_num is not None:
                        current_q_lines.append(txt)
                        current_q_spans.append((pno, y0, x0, x1, y1, txt))

        flush_q()

        # Build chapter output
        mcqs_out = []
        for q in raw_mcqs:
            qnum = q["qnum"]
            if qnum not in mcq_answers:
                continue
            stem_c, opts_c, img_url, opt_imgs = resolve_visuals(
                doc, "physics", cnum, qnum, q["stem"], list(q["options"]) if q["options"] else None,
                q.get("spans", []), q["imgs"], q.get("opt_kind"), q.get("next_y"), q.get("full_raw", ""),
            )
            mcqs_out.append({
                "id": f"phy-ch{cnum}-mcq-{qnum}",
                "type": "mcq",
                "subject": "physics",
                "chapterNumber": cnum,
                "chapterName": cname,
                "questionNumber": qnum,
                "question": stem_c,
                "options": opts_c,
                "correctIndex": mcq_answers[qnum],
                "difficulty": q["difficulty"],
                **({"imageUrl": img_url} if img_url else {}),
                **({"optionImages": opt_imgs} if opt_imgs else {}),
            })

        fibs_out = []
        for q in raw_fibs:
            qnum = q["qnum"]
            if qnum not in fib_answers:
                continue
            fibs_out.append({
                "id": f"phy-ch{cnum}-fib-{qnum}",
                "type": "fib",
                "subject": "physics",
                "chapterNumber": cnum,
                "chapterName": cname,
                "setNumber": q["setNumber"],
                "wordBank": q["wordBank"],
                "questionNumber": qnum,
                "question": q["stem"],
                "answer": fib_answers[qnum],
                "difficulty": q["difficulty"],
            })

        results.append({
            "chapterNumber": cnum,
            "chapterName": cname,
            "mcqs": mcqs_out,
            "fibs": fibs_out,
        })

    return results


def parse_chemistry(doc: pymupdf.Document, chapters):
    """
    Chemistry PDF has:
      Unit N ...
      MULTIPLE CHOICE QUESTIONS (MCQS) (ONE MARK)
      ...
      Fill in the blanks ...
      Set-1 (word1, word2, ...)
      ...
      At pages 224+:
      Unit N - NAME:
      KEY ANSWERS FOR MULTIPLE CHOICE QUESTIONS:
      KEY ANSWERS FOR FILL IN THE BLANKS QUESTIONS
    """
    # 1. Parse Answer Keys at the end of the PDF (pages 220+)
    mcq_keys = {}  # unit -> {qnum: idx} (or for unit 10: {(subtopic_code, qnum): idx})
    fib_keys = {}  # unit -> {(set_num, qnum): ans}
    cur_unit = None
    ans_mode = None
    cur_set = 1
    u10_sub = "10.0"

    for pno in range(220, len(doc)):
        txt = doc[pno].get_text("text")
        lines_raw = [l.strip() for l in txt.splitlines() if l.strip()]
        vis_rows = [r[4].strip() for r in extract_lines_with_y(doc[pno], detect_fractions=False)]

        # Also handle row-wise tables (used in Unit 10 Biomolecules MCQs and 2/3-column Set FIBs)
        multi_col_fib_sets = None
        for ri, rtxt in enumerate(vis_rows):
            um = re.match(r"Unit\s*[-–]?\s*(\d+)\b", rtxt, re.I)
            if um:
                cur_unit_vr = int(um.group(1))
                mcq_keys.setdefault(cur_unit_vr, {})
                fib_keys.setdefault(cur_unit_vr, {})
                multi_col_fib_sets = None
            if re.search(r"KEY\s+ANSWERS\s+FOR\s+FILL\s+IN\s+THE\s+BLANKS", rtxt, re.I):
                multi_col_fib_sets = None
            sets_in_row = re.findall(r"Set\s*[-–]?\s*(\d+)", rtxt, re.I)
            if len(sets_in_row) >= 2 and cur_unit is not None:
                multi_col_fib_sets = [int(s) for s in sets_in_row]
                continue
            elif len(sets_in_row) == 1:
                multi_col_fib_sets = None
            if multi_col_fib_sets and cur_unit is not None:
                # Split 2 or 3 side-by-side FIB columns ("1 bromine water   1 milk sugar" or "1. Negative   1.Less   1. Non-electrolyte")
                cols = [c.strip() for c in re.split(r"\s{2,}(?=\d+[\.\s])", rtxt.strip()) if c.strip()]
                if len(cols) == len(multi_col_fib_sets):
                    for set_id, col_txt in zip(multi_col_fib_sets, cols):
                        mc = re.match(r"^(\d+)\.?\s*(.+)$", col_txt)
                        if mc:
                            fib_keys.setdefault(cur_unit, {})[(set_id, int(mc.group(1)))] = mc.group(2).strip().rstrip(".,")

        if cur_unit == 10 or re.search(r"Unit\s*[-–]?\s*10\b", txt, re.I):
            for ri, rtxt in enumerate(vis_rows):
                um = re.match(r"Unit\s*[-–]?\s*(\d+)\b", rtxt, re.I)
                if um:
                    cur_unit = int(um.group(1))
                    mcq_keys.setdefault(cur_unit, {})
                    fib_keys.setdefault(cur_unit, {})
                    ans_mode = None
                    continue
                if re.search(r"KEY\s+ANSWERS\s+FOR\s+MULTIPLE\s+CHOICE", rtxt, re.I):
                    ans_mode = "mcq"
                    continue
                if re.search(r"KEY\s+ANSWERS\s+FOR\s+FILL\s+IN\s+THE\s+BLANKS", rtxt, re.I):
                    ans_mode = "fib"
                    continue
                if cur_unit == 10:
                    sm10 = re.match(r"^(10\.\d)\b", rtxt)
                    if sm10:
                        u10_sub = sm10.group(1)
                        continue
                    if re.match(r"^Introduction\b", rtxt, re.I):
                        u10_sub = "10.0"
                        continue
                    if ans_mode == "mcq" and ri + 1 < len(vis_rows):
                        r1 = rtxt.split()
                        r2 = vis_rows[ri + 1].split()
                        if r1 and r2 and len(r1) == len(r2) and all(re.fullmatch(r"\d{1,2}", t) for t in r1) and all(re.fullmatch(r"[a-dA-D]", t) for t in r2):
                            for qn_s, ans_s in zip(r1, r2):
                                key_t = (u10_sub, int(qn_s))
                                if key_t not in mcq_keys[10]:
                                    mcq_keys[10][key_t] = ord(ans_s.lower()) - ord("a")

        i = 0
        while i < len(lines_raw):
            line = lines_raw[i]
            um = re.match(r"Unit\s*[-–]?\s*(\d+)\b", line, re.I)
            if um:
                cur_unit = int(um.group(1))
                mcq_keys.setdefault(cur_unit, {})
                fib_keys.setdefault(cur_unit, {})
                ans_mode = None
                i += 1
                continue
            if re.search(r"KEY\s+ANSWERS\s+FOR\s+MULTIPLE\s+CHOICE", line, re.I):
                ans_mode = "mcq"
                i += 1
                continue
            if re.search(r"KEY\s+ANSWERS\s+FOR\s+FILL\s+IN\s+THE\s+BLANKS", line, re.I):
                ans_mode = "fib"
                cur_set = 1
                i += 1
                continue
            if cur_unit is None:
                i += 1
                continue
            if ans_mode == "mcq" and cur_unit != 10:
                for qn, ch in re.findall(r"\b(\d{1,3})\s+([a-dA-D])\b", line):
                    mcq_keys[cur_unit][int(qn)] = ord(ch.lower()) - ord("a")
                if re.fullmatch(r"\d{1,3}", line) and i + 1 < len(lines_raw):
                    m_next = re.match(r"^([a-dA-D])(?:\s|$)", lines_raw[i + 1])
                    if m_next:
                        mcq_keys[cur_unit][int(line)] = ord(m_next.group(1).lower()) - ord("a")
                m_tail = re.search(r"\b(\d{1,3})$", line)
                if m_tail and i + 1 < len(lines_raw):
                    m_next = re.match(r"^([a-dA-D])(?:\s|$)", lines_raw[i + 1])
                    if m_next:
                        mcq_keys[cur_unit][int(m_tail.group(1))] = ord(m_next.group(1).lower()) - ord("a")
            elif ans_mode == "fib":
                sm = re.match(r"SET\s*[-–]?\s*(\d+)\b", line, re.I)
                if sm and not re.search(r"Set\s*[-–]?\s*\d+.*Set\s*[-–]?\s*\d+", line, re.I):
                    cur_set = int(sm.group(1))
                    i += 1
                    continue
                qm = re.match(r"(\d+)\.\s*(.+)$", line)
                if qm and not re.search(r"\s{2,}\d+\s+", line):
                    fib_keys[cur_unit][(cur_set, int(qm.group(1)))] = qm.group(2).strip().rstrip(".")
            i += 1

    # 2. Find unit start pages in main body (pages 3..220)
    unit_starts = {}
    for pno in range(3, 222):
        txt = doc[pno].get_text("text")
        m = re.search(r"^\s*Unit\s*[-–]?\s*(\d+)\b", txt, re.M | re.I)
        if m:
            unum = int(m.group(1))
            if unum not in unit_starts and 1 <= unum <= 10:
                unit_starts[unum] = pno

    sorted_units = sorted(unit_starts.items(), key=lambda x: x[1])
    unit_ranges = {}
    for idx, (unum, sp) in enumerate(sorted_units):
        ep = sorted_units[idx + 1][1] if idx + 1 < len(sorted_units) else 222
        unit_ranges[unum] = (sp, ep)

    results = []
    for cnum, cname in chapters:
        if cnum not in unit_ranges:
            continue
        sp, ep = unit_ranges[cnum]
        mode = None
        current_q_num = None
        current_q_lines = []
        current_q_imgs = []
        current_q_spans = []
        current_q_next_y = 9999
        raw_mcqs = []
        raw_fibs = []
        current_set = 1
        current_word_bank = []
        last_mcq_num = 0
        u10_sub = "10.0"
        shared_ar_opts = None
        collecting_ar_rubric = False
        ar_rubric_lines = []

        def flush_q():
            nonlocal current_q_num, current_q_lines, current_q_imgs, current_q_spans, current_q_next_y
            if current_q_num is None or not current_q_lines:
                current_q_num = None
                current_q_lines = []
                current_q_imgs = []
                current_q_spans = []
                current_q_next_y = 9999
                return
            full = "\n".join(current_q_lines)
            if mode == "mcq":
                parsed = parse_mcq_options_with_kind(full)
                if not parsed and shared_ar_opts and re.search(r"\bSTATEMENT\b", full, re.I) and not current_q_imgs:
                    stem_ar, diff = strip_difficulty(full)
                    raw_mcqs.append({
                        "qnum": current_q_num,
                        "subtopic": u10_sub,
                        "stem": clean_text(stem_ar),
                        "options": list(shared_ar_opts),
                        "opt_kind": "lower_rparen",
                        "next_y": current_q_next_y,
                        "full_raw": full,
                        "difficulty": diff,
                        "imgs": [],
                        "spans": list(current_q_spans),
                        "unparsed": False,
                    })
                elif parsed:
                    stem, opts, opt_kind = parsed
                    _, diff = strip_difficulty(full)
                    stem, _ = strip_difficulty(stem)
                    opts = [strip_difficulty(o)[0] for o in opts]
                    raw_mcqs.append({
                        "qnum": current_q_num,
                        "subtopic": u10_sub,
                        "stem": clean_text(stem),
                        "options": opts,
                        "opt_kind": opt_kind,
                        "next_y": current_q_next_y,
                        "full_raw": full,
                        "difficulty": diff,
                        "imgs": list(current_q_imgs),
                        "spans": list(current_q_spans),
                        "unparsed": False,
                    })
                else:
                    # Retain unparsed MCQs that contain diagrams/vector reactions (or U5 Q93 stem setup)
                    stem, diff = strip_difficulty(full)
                    raw_mcqs.append({
                        "qnum": current_q_num,
                        "subtopic": u10_sub,
                        "stem": clean_text(stem),
                        "options": None,
                        "opt_kind": None,
                        "next_y": current_q_next_y,
                        "full_raw": full,
                        "difficulty": diff,
                        "imgs": list(current_q_imgs),
                        "spans": list(current_q_spans),
                        "unparsed": True,
                    })
            elif mode == "fib":
                stem, diff = strip_difficulty(full)
                raw_fibs.append({
                    "qnum": current_q_num,
                    "setNumber": current_set,
                    "wordBank": list(current_word_bank),
                    "stem": clean_text(stem),
                    "difficulty": diff,
                    "spans": list(current_q_spans),
                })
            current_q_num = None
            current_q_lines = []
            current_q_imgs = []
            current_q_spans = []
            current_q_next_y = 9999

        for pno in range(sp, ep):
            page = doc[pno]
            lines = extract_lines_with_y(page)
            page_imgs = get_page_images(page)
            is_u7_raster_page = (cnum == 7 and mode == "mcq" and current_q_num == 75 and "Cu at 573K" in page.get_text("text"))
            if is_u7_raster_page:
                flush_q()

            for idx_l, (y0, x0, x1, y1, txt) in enumerate(lines):
                if is_u7_raster_page and y0 < 470.0:
                    continue
                if re.search(r"TWO\s*(?:/|OR)?\s*THREE\s+MARKS?\s*QUESTIONS?|TWO\s+MARKS?\s+QUESTIONS|2\s+MARKS?\s+QUESTIONS|SHORT\s+ANSWER\s*\(TWO", txt, re.I):
                    flush_q()
                    shared_ar_opts = None
                    collecting_ar_rubric = False
                    mode = "done"
                    break
                if re.search(r"MULTIPLE\s+CHOICE\s+QUESTIONS", txt, re.I):
                    flush_q()
                    shared_ar_opts = None
                    collecting_ar_rubric = False
                    mode = "mcq"
                    continue
                if re.search(r"Fill\s+in\s+the\s+blanks", txt, re.I):
                    flush_q()
                    shared_ar_opts = None
                    collecting_ar_rubric = False
                    mode = "fib"
                    continue
                if mode in (None, "done"):
                    continue

                if mode == "mcq" and re.search(r"Each\s+question\s+contains\s+STATEMENT", txt, re.I):
                    flush_q()
                    collecting_ar_rubric = True
                    ar_rubric_lines = []
                    shared_ar_opts = None
                    continue
                if collecting_ar_rubric:
                    if re.match(r"^(?:10\.\d|\d+[.)](?!\d)\s*Statement)", txt, re.I):
                        collecting_ar_rubric = False
                    else:
                        if re.match(r"^\(?[a-dA-D][.)]", txt.strip()):
                            ar_rubric_lines.append(txt)
                        elif ar_rubric_lines:
                            ar_rubric_lines.append(txt)
                        if len(ar_rubric_lines) >= 2:
                            parsed_ar = parse_mcq_options_with_kind("\n".join(ar_rubric_lines))
                            if parsed_ar and all(o.strip() for o in parsed_ar[1]):
                                shared_ar_opts = [strip_difficulty(o)[0] for o in parsed_ar[1]]
                                collecting_ar_rubric = False
                        continue

                if cnum == 10 and mode == "mcq":
                    sm10 = re.match(r"^(10\.\d)\b", txt)
                    if sm10:
                        flush_q()
                        u10_sub = sm10.group(1)
                        last_mcq_num = 0
                        continue
                    if re.match(r"^10\.\s*INTRODUCTION", txt, re.I):
                        flush_q()
                        u10_sub = "10.0"
                        last_mcq_num = 0
                        continue

                if mode == "fib":
                    sm = re.match(r"Set\s*[-–]?\s*(\d+)", txt, re.I)
                    if sm:
                        flush_q()
                        current_set = int(sm.group(1))
                        current_word_bank = []
                        continue
                    if txt.startswith("(") and ")" in txt and not re.match(r"^\d+[.)](?!\d)", txt) and "," in txt:
                        wb = txt[1 : txt.rfind(")")]
                        current_word_bank = [w.strip() for w in wb.split(",") if w.strip()]
                        continue

                qm = re.match(r"^(\d+)[.)](?!\d)\s*(.*)$", txt)
                qm_nodot = None
                if not qm and mode == "mcq" and x0 < 52.0:
                    qm_nodot = re.match(r"^(\d+)\s+([A-Z].*)$", txt)
                is_valid_new_q = False
                if qm and ((mode == "mcq" and x0 < 58.0) or (mode == "fib" and x0 < 100.0)):
                    cand_qn = int(qm.group(1))
                    if mode == "mcq" and (
                        (x0 >= 55.0 and cand_qn <= last_mcq_num)
                        or (x0 < 55.0 and cand_qn <= last_mcq_num - 2)
                    ):
                        is_valid_new_q = False
                    else:
                        is_valid_new_q = True
                        if mode == "mcq":
                            last_mcq_num = max(last_mcq_num, cand_qn)
                elif qm_nodot and int(qm_nodot.group(1)) == last_mcq_num + 1:
                    cand_qn = int(qm_nodot.group(1))
                    qm = qm_nodot
                    is_valid_new_q = True
                    last_mcq_num = cand_qn

                if is_valid_new_q:
                    flush_q()
                    # Capture Unit 7 Q76..78 where KSEAB embedded "76."/"77."/"78." as raster images above Q79
                    if cnum == 7 and mode == "mcq" and cand_qn == 79 and last_mcq_num == 79:
                        existing_nums = {q["qnum"] for q in raw_mcqs}
                        for img_qn, band in [(76, (26.0, 44.0, 502.0, 175.5)), (77, (26.0, 178.0, 502.0, 308.0)), (78, (26.0, 314.0, 520.0, 464.5))]:
                            if img_qn not in existing_nums and img_qn in mcq_keys.get(7, {}):
                                rect_u = pymupdf.Rect(band) & page.rect
                                out_u = OUT_IMG_DIR / "chemistry" / f"ch7_q{img_qn}_full.png"
                                out_u.parent.mkdir(parents=True, exist_ok=True)
                                pix_u = page.get_pixmap(matrix=pymupdf.Matrix(2.5, 2.5), clip=rect_u)
                                if img_qn == 78:
                                    # Reset pixmap origin to (0, 0) so IRect masks bottom-right [A] badge reliably without clipping "is"
                                    pix_u.set_origin(0, 0)
                                    pix_u.clear_with(255, pymupdf.IRect(int((495.0 - band[0]) * 2.5), int((430.0 - band[1]) * 2.5), pix_u.width, pix_u.height))
                                pix_u.save(str(out_u))
                                crop_u = "/" + out_u.relative_to(ROOT / "public").as_posix()
                                if crop_u:
                                    raw_mcqs.append({
                                        "qnum": img_qn,
                                        "subtopic": u10_sub,
                                        "stem": f"Solve Question {img_qn} shown below:",
                                        "options": ["Option (A) — See figure", "Option (B) — See figure", "Option (C) — See figure", "Option (D) — See figure"],
                                        "opt_kind": None,
                                        "next_y": band[3],
                                        "full_raw": "",
                                        "difficulty": "Average" if img_qn == 78 else ("Difficult" if img_qn == 77 else "Easy"),
                                        "imgs": [(pno, band)],
                                        "spans": [],
                                        "unparsed": False,
                                        "prebuilt_img": crop_u,
                                    })
                    current_q_num = cand_qn
                    current_q_spans.append((pno, y0, x0, x1, y1, txt))
                    rest = qm.group(2).strip()
                    if rest:
                        current_q_lines.append(rest)
                    next_y = 9999
                    for ny0, nx0, _, _, ntxt in lines[idx_l + 1 :]:
                        if re.search(r"Fill\s+in\s+the\s+blanks|TWO/THREE|TWO\s+MARKS", ntxt, re.I):
                            next_y = ny0
                            break
                        if nx0 < 58.0 and re.match(r"^\d+[.)](?!\d)\s*", ntxt):
                            next_y = ny0
                            break
                    current_q_next_y = next_y
                    for ib in page_imgs:
                        ymid = (ib[1] + ib[3]) / 2.0
                        if y0 - 16.0 <= ymid <= next_y - 2.0 and ib[1] <= next_y - 4.0:
                            current_q_imgs.append((pno, ib))
                else:
                    if current_q_num is not None:
                        current_q_lines.append(txt)
                        current_q_spans.append((pno, y0, x0, x1, y1, txt))

        flush_q()

        u_mcq_keys = mcq_keys.get(cnum, {})
        u_fib_keys = fib_keys.get(cnum, {})

        mcqs_out = []
        seq_u10 = 0
        pending_stem_prefix = None
        for q in raw_mcqs:
            qnum = q["qnum"]
            if q.get("prebuilt_img"):
                mcqs_out.append({
                    "id": f"chem-ch{cnum}-mcq-{qnum}",
                    "type": "mcq",
                    "subject": "chemistry",
                    "chapterNumber": cnum,
                    "chapterName": cname,
                    "questionNumber": qnum,
                    "question": q["stem"],
                    "options": q["options"],
                    "correctIndex": u_mcq_keys[qnum],
                    "difficulty": q["difficulty"],
                    "imageUrl": q["prebuilt_img"],
                })
                continue
            if cnum == 5 and qnum == 93 and q.get("unparsed") and not q["imgs"]:
                pending_stem_prefix = q["stem"]
                continue
            if cnum == 10:
                key_lookup = (q.get("subtopic", "10.0"), qnum)
                if key_lookup not in u_mcq_keys:
                    continue
                seq_u10 += 1
                out_qnum = seq_u10
                ans_idx = u_mcq_keys[key_lookup]
            else:
                if qnum not in u_mcq_keys:
                    continue
                out_qnum = qnum
                ans_idx = u_mcq_keys[qnum]
            stem_in = f"{pending_stem_prefix}\n{q['stem']}" if pending_stem_prefix else q["stem"]
            pending_stem_prefix = None
            stem_c, opts_c, img_url, opt_imgs = resolve_visuals(
                doc, "chemistry", cnum, out_qnum, stem_in,
                list(q["options"]) if q["options"] else None,
                q.get("spans", []), q["imgs"], q.get("opt_kind"), q.get("next_y"), q.get("full_raw", ""),
            )
            if not opts_c or not isinstance(opts_c, list) or len(opts_c) != 4:
                continue
            mcqs_out.append({
                "id": f"chem-ch{cnum}-mcq-{out_qnum}",
                "type": "mcq",
                "subject": "chemistry",
                "chapterNumber": cnum,
                "chapterName": cname,
                "questionNumber": out_qnum,
                "question": stem_c,
                "options": opts_c,
                "correctIndex": ans_idx,
                "difficulty": q["difficulty"],
                **({"imageUrl": img_url} if img_url else {}),
                **({"optionImages": opt_imgs} if opt_imgs else {}),
            })

        fibs_out = []
        for q in raw_fibs:
            qnum = q["qnum"]
            ans = u_fib_keys.get((q["setNumber"], qnum))
            if not ans:
                continue
            fibs_out.append({
                "id": f"chem-ch{cnum}-fib-{q['setNumber']}-{qnum}",
                "type": "fib",
                "subject": "chemistry",
                "chapterNumber": cnum,
                "chapterName": cname,
                "setNumber": q["setNumber"],
                "wordBank": q["wordBank"],
                "questionNumber": qnum,
                "question": q["stem"],
                "answer": ans,
                "difficulty": q["difficulty"],
            })

        results.append({
            "chapterNumber": cnum,
            "chapterName": cname,
            "mcqs": mcqs_out,
            "fibs": fibs_out,
        })

    return results


def parse_mathematics(doc: pymupdf.Document, chapters):
    """
    Mathematics PDF has:
      CHAPTER -01 ... (pages 4..112)
      KEY ANSWERS TO MULTIPLE CHOICE QUESTIONS (pages 160..164)
      In Maths, both MCQs and FIBs are in the same numbered list per chapter;
      Answer key has A/B/C/D for MCQs and numeric/text values for FIBs!
    """
    # 1. Parse Answer Keys on pages 159..164 (with fraction reconstruction + column-x alignment)
    chap_keys = {}  # cnum -> {qnum: str_val}
    cur_chap = None
    for pno in range(158, len(doc)):
        lines = extract_lines_with_y(doc[pno], detect_fractions=True)
        chap_segs = []
        seg_chap = None
        seg_rows = []
        for y0, x0, x1, y1, txt in lines:
            cm = re.search(r"CHAPTER\s*[-–]?\s*0*(\d+)", txt, re.I)
            if cm:
                if seg_chap is not None:
                    chap_segs.append((seg_chap, seg_rows))
                seg_chap = int(cm.group(1))
                chap_keys.setdefault(seg_chap, {})
                seg_rows = []
                continue
            if seg_chap is None:
                if cur_chap is not None:
                    seg_chap = cur_chap
                else:
                    continue
            if not seg_rows or abs(y0 - seg_rows[-1][0]) > 6:
                seg_rows.append([y0, [txt]])
            else:
                seg_rows[-1][1].append(txt)
        if seg_chap is not None:
            chap_segs.append((seg_chap, seg_rows))
            cur_chap = seg_chap

        for sc, srows in chap_segs:
            idx_r = 0
            while idx_r + 1 < len(srows):
                r_nums = " ".join(srows[idx_r][1]).split()
                r_ans = " ".join(srows[idx_r + 1][1]).split()
                if r_nums and all(re.fullmatch(r"\d+", t) for t in r_nums):
                    if len(r_ans) == len(r_nums):
                        for qn, av in zip(r_nums, r_ans):
                            chap_keys[sc][int(qn)] = av.strip()
                        idx_r += 2
                        continue
                    # Merge stray standalone minus sign before a fraction (e.g. '−' '$\frac{1}{2}$')
                    merged_ans = []
                    k = 0
                    while k < len(r_ans):
                        if r_ans[k] in ("-", "−") and k + 1 < len(r_ans):
                            merged_ans.append(r_ans[k] + r_ans[k + 1])
                            k += 2
                        else:
                            merged_ans.append(r_ans[k])
                            k += 1
                    if len(merged_ans) == len(r_nums):
                        for qn, av in zip(r_nums, merged_ans):
                            chap_keys[sc][int(qn)] = av.strip()
                        idx_r += 2
                        continue
                idx_r += 1

    # 2. Find chapter starts in pages 3..113
    chap_starts = {}
    for pno in range(2, 113):
        txt = doc[pno].get_text("text")
        m = re.search(r"CHAPTER\s*[-–]?\s*0*(\d+)", txt, re.I)
        if m:
            cnum = int(m.group(1))
            if cnum not in chap_starts:
                chap_starts[cnum] = pno

    sorted_chaps = sorted(chap_starts.items(), key=lambda x: x[1])
    chap_ranges = {}
    for idx, (cnum, sp) in enumerate(sorted_chaps):
        ep = sorted_chaps[idx + 1][1] if idx + 1 < len(sorted_chaps) else 112
        chap_ranges[cnum] = (sp, ep)

    results = []
    for cnum, cname in chapters:
        if cnum not in chap_ranges:
            continue
        sp, ep = chap_ranges[cnum]
        mode = "mcq_fib"
        current_q_num = None
        current_q_lines = []
        current_q_imgs = []
        current_q_spans = []
        current_q_next_y = 9999
        last_q_num = 0
        raw_items = []

        def flush_q():
            nonlocal current_q_num, current_q_lines, current_q_imgs, current_q_spans, current_q_next_y
            if current_q_num is None or not current_q_lines:
                current_q_num = None
                current_q_lines = []
                current_q_imgs = []
                current_q_spans = []
                current_q_next_y = 9999
                return
            full = "\n".join(current_q_lines)
            raw_items.append({
                "qnum": current_q_num,
                "full": full,
                "imgs": list(current_q_imgs),
                "spans": list(current_q_spans),
                "next_y": current_q_next_y,
            })
            current_q_num = None
            current_q_lines = []
            current_q_imgs = []
            current_q_spans = []
            current_q_next_y = 9999

        for pno in range(sp, ep):
            page = doc[pno]
            lines = extract_lines_with_y(page)
            page_imgs = get_page_images(page)

            for idx_l, (y0, x0, x1, y1, txt) in enumerate(lines):
                if re.search(r"TWO\s+MARKS?|2\s+MARKS?|THREE\s+MARKS?|FIVE\s+MARKS?|Part\s*[-–]?\s*B\b", txt, re.I):
                    flush_q()
                    mode = "done"
                    break
                if mode == "done":
                    break
                qm = re.match(r"^(\d+)[.)](?!\d)\s*(.*)$", txt)
                is_valid_new_q = bool(qm and x0 < 95.0)
                if is_valid_new_q:
                    cand_qn = int(qm.group(1))
                    if last_q_num >= 5 and cand_qn <= last_q_num - 2 and (x0 > 42.0 or cand_qn <= 5):
                        is_valid_new_q = False
                    else:
                        last_q_num = cand_qn
                if is_valid_new_q:
                    # Move preceding top-row matrix/determinant line (e.g. '2x 4 4' or '0 sinα −cosα') that sits
                    # <= 17.5pt above this question number out of previous question and into this question
                    top_carried_line = None
                    top_carried_span = None
                    if (
                        len(current_q_lines) >= 2
                        and current_q_spans
                        and current_q_spans[-1][0] == pno
                        and 0.0 < y0 - current_q_spans[-1][1] <= 17.5
                        and not re.match(r"^(?:\([A-D]\)|[A-D][.)]|Statement|Reason|Which|If|Find|\d+[.)])", current_q_lines[-1], re.I)
                        and re.search(r"\([A-D]\)|[A-D]\)|Easy|Average|Difficult", current_q_lines[-2])
                    ):
                        top_carried_line = current_q_lines.pop()
                        top_carried_span = current_q_spans.pop()
                        current_q_next_y = top_carried_span[1]
                    flush_q()
                    current_q_num = int(qm.group(1))
                    if top_carried_span is not None:
                        current_q_spans.append(top_carried_span)
                        current_q_lines.append(top_carried_line)
                    current_q_spans.append((pno, y0, x0, x1, y1, txt))
                    rest = qm.group(2).strip()
                    if rest:
                        current_q_lines.append(rest)
                    next_y = 9999
                    for off_n, (ny0, nx0, _, _, ntxt) in enumerate(lines[idx_l + 1 :]):
                        if re.search(r"TWO\s+MARKS?|2\s+MARKS?|THREE\s+MARKS?|FIVE\s+MARKS?|Part\s*[-–]?\s*B\b", ntxt, re.I):
                            next_y = ny0
                            break
                        nm = re.match(r"^(\d+)[.)](?!\d)\s*", ntxt)
                        if nm and nx0 < 95.0:
                            nqn = int(nm.group(1))
                            if not (last_q_num >= 5 and nqn <= last_q_num - 2 and (nx0 > 42.0 or nqn <= 5)):
                                next_y = ny0
                                # If line right above next question is a top matrix row (<=17.5pt above ny0), stop before it!
                                if idx_l + off_n >= 1 and 0.0 < ny0 - lines[idx_l + off_n][0] <= 17.5:
                                    prev_ntxt = lines[idx_l + off_n][4]
                                    if not re.match(r"^(?:\([A-D]\)|[A-D][.)]|Statement|Reason|Which|If|Find|\d+[.)])", prev_ntxt, re.I):
                                        if idx_l + off_n - 1 >= 0 and re.search(r"\([A-D]\)|[A-D]\)|Easy|Average|Difficult", lines[idx_l + off_n - 1][4]):
                                            next_y = lines[idx_l + off_n][0]
                                break
                    current_q_next_y = next_y
                    for ib in page_imgs:
                        ymid = (ib[1] + ib[3]) / 2.0
                        if y0 - 16.0 <= ymid <= next_y - 2.0 and ib[1] <= next_y - 4.0:
                            current_q_imgs.append((pno, ib))
                else:
                    if current_q_num is not None:
                        current_q_lines.append(txt)
                        current_q_spans.append((pno, y0, x0, x1, y1, txt))
        flush_q()

        keys = chap_keys.get(cnum, {})
        mcqs_out = []
        fibs_out = []
        for item in raw_items:
            qnum = item["qnum"]
            if qnum not in keys:
                continue
            ans_val = keys[qnum]
            parsed = parse_mcq_options_with_kind(item["full"])
            # Fix known KSEAB Ch6 Q35 answer key typo ('8' printed for Assertion-Reason MCQ Q35)
            if cnum == 6 and qnum == 35 and parsed and ans_val.upper() not in ("A", "B", "C", "D"):
                ans_val = "A"

            if parsed and ans_val.upper() in ("A", "B", "C", "D"):
                stem, opts, opt_kind = parsed
                _, diff = strip_difficulty(item["full"])
                stem, _ = strip_difficulty(stem)
                opts = [strip_difficulty(o)[0] for o in opts]
                stem_c, opts_c, img_url, opt_imgs = resolve_visuals(
                    doc, "mathematics", cnum, qnum, clean_text(stem), opts,
                    item.get("spans", []), item["imgs"], opt_kind, item.get("next_y"), item["full"],
                )
                mcqs_out.append({
                    "id": f"math-ch{cnum}-mcq-{qnum}",
                    "type": "mcq",
                    "subject": "mathematics",
                    "chapterNumber": cnum,
                    "chapterName": cname,
                    "questionNumber": qnum,
                    "question": stem_c,
                    "options": opts_c,
                    "correctIndex": ord(ans_val.upper()) - ord("A"),
                    "difficulty": diff,
                    **({"imageUrl": img_url} if img_url else {}),
                    **({"optionImages": opt_imgs} if opt_imgs else {}),
                })
            elif not parsed and ans_val.upper() in ("A", "B", "C", "D"):
                stem, diff = strip_difficulty(item["full"])
                stem_c, opts_c, img_url_f, opt_imgs_f = resolve_visuals(
                    doc, "mathematics", cnum, qnum, clean_text(stem), None,
                    item.get("spans", []), item["imgs"], None, item.get("next_y"), item["full"],
                )
                if not opts_c:
                    opts_c = ["Option (A) — See figure", "Option (B) — See figure", "Option (C) — See figure", "Option (D) — See figure"]
                mcqs_out.append({
                    "id": f"math-ch{cnum}-mcq-{qnum}",
                    "type": "mcq",
                    "subject": "mathematics",
                    "chapterNumber": cnum,
                    "chapterName": cname,
                    "questionNumber": qnum,
                    "question": stem_c,
                    "options": opts_c,
                    "correctIndex": ord(ans_val.upper()) - ord("A"),
                    "difficulty": diff,
                    **({"imageUrl": img_url_f} if img_url_f else {}),
                    **({"optionImages": opt_imgs_f} if opt_imgs_f else {}),
                })
            elif not parsed and ans_val.upper() not in ("A", "B", "C", "D"):
                stem, diff = strip_difficulty(item["full"])
                stem_c, _, img_url, _ = resolve_visuals(
                    doc, "mathematics", cnum, qnum, clean_text(stem), None,
                    item.get("spans", []), item["imgs"], None, item.get("next_y"), item["full"],
                )
                fibs_out.append({
                    "id": f"math-ch{cnum}-fib-{qnum}",
                    "type": "fib",
                    "subject": "mathematics",
                    "chapterNumber": cnum,
                    "chapterName": cname,
                    "setNumber": 1,
                    "wordBank": [],
                    "questionNumber": qnum,
                    "question": stem_c,
                    "answer": ans_val,
                    "difficulty": diff,
                    **({"imageUrl": img_url} if img_url else {}),
                })

        results.append({
            "chapterNumber": cnum,
            "chapterName": cname,
            "mcqs": mcqs_out,
            "fibs": fibs_out,
        })

    return results


def main():
    for subj, cfg in PDF_CONFIGS.items():
        doc = pymupdf.open(str(cfg["path"]))
        if subj == "physics":
            chapters_data = parse_physics(doc, cfg["chapters"])
        elif subj == "chemistry":
            chapters_data = parse_chemistry(doc, cfg["chapters"])
        else:
            chapters_data = parse_mathematics(doc, cfg["chapters"])

        total_mcq = sum(len(c["mcqs"]) for c in chapters_data)
        total_fib = sum(len(c["fibs"]) for c in chapters_data)
        total_img = sum(
            1 for c in chapters_data for q in (c["mcqs"] + c["fibs"]) if q.get("imageUrl")
        )
        print(f"[{subj.upper()}] Chapters: {len(chapters_data)} | MCQs: {total_mcq} | FIBs: {total_fib} | Diagrams: {total_img}")
        for c in chapters_data:
            print(f"   Ch {c['chapterNumber']:2d} ({c['chapterName']}): {len(c['mcqs'])} MCQs, {len(c['fibs'])} FIBs")

        out_file = OUT_DATA_DIR / f"{subj}-qb.json"
        payload = {
            "subject": subj,
            "subjectCode": cfg["subjectCode"],
            "subjectName": cfg["subjectName"],
            "chapters": chapters_data,
        }
        out_file.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    main()
