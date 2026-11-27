import json, pymupdf, re
from pathlib import Path
from scripts.extract_puc_qb import extract_lines_with_y, PDF_CONFIGS

# 1. Physics missing 3 Qs + 1 empty_opt
phy = json.loads(Path("src/data/puc-qb/physics-qb.json").read_text(encoding="utf-8"))
for ch in phy["chapters"]:
    for q in ch["mcqs"]:
        if any(not o.strip() for i, o in enumerate(q["options"]) if not (q.get("optionImages") and q["optionImages"][i])):
            print("PHY EMPTY_OPT:", ch["chapterNumber"], q["questionNumber"], q["question"][:60], q["options"])

doc_p = pymupdf.open(str(PDF_CONFIGS["physics"]["path"]))
for label, pno in [("PHY Ch9 p68", 67), ("PHY Ch10 p76", 75), ("PHY Ch12 p87", 86)]:
    print(f"--- {label} ---")
    for l in extract_lines_with_y(doc_p[pno])[:12]:
        print(" ", l[4][:75])

# 2. Maths unbalanced_$ and Ch2 41..55 + Ch6 Q35 + out_of_order
math = json.loads(Path("src/data/puc-qb/mathematics-qb.json").read_text(encoding="utf-8"))
for ch in math["chapters"]:
    prev = 0
    for q in ch["mcqs"]:
        if q["questionNumber"] <= prev:
            print("MATH OUT_OF_ORDER:", ch["chapterNumber"], prev, "->", q["questionNumber"])
        prev = q["questionNumber"]
        for f in [q["question"]] + q["options"]:
            if len(re.findall(r"(?<!\\)\$", f)) % 2 != 0:
                print("MATH UNBALANCED_$:", ch["chapterNumber"], q["questionNumber"], repr(f[:90]))

doc_m = pymupdf.open(str(PDF_CONFIGS["mathematics"]["path"]))
print("--- MATH Ch2 p160-161 keys ---")
for l in extract_lines_with_y(doc_m[159], detect_fractions=False)[-16:]:
    print(" ", l[4])

# 3. Chem out_of_order + Ch10 Q3/7..9 + Ch7 FIB keys
chem = json.loads(Path("src/data/puc-qb/chemistry-qb.json").read_text(encoding="utf-8"))
for ch in chem["chapters"]:
    prev = 0
    for q in ch["mcqs"]:
        if q["questionNumber"] <= prev:
            print("CHEM OUT_OF_ORDER:", ch["chapterNumber"], prev, "->", q["questionNumber"])
        prev = q["questionNumber"]

doc_c = pymupdf.open(str(PDF_CONFIGS["chemistry"]["path"]))
print("--- CHEM Ch10 p197-198 ---")
for l in extract_lines_with_y(doc_c[196])[:14]:
    print(" ", l[4][:75])
for p in range(230, len(doc_c)):
    t = doc_c[p].get_text("text")
    if re.search(r"Unit\s*[-–]?\s*7\b", t, re.I):
        print(f"--- CHEM Unit 7 key p{p+1} ---")
        print(t[:700])
