import json, pymupdf
from pathlib import Path

math = json.loads(Path("src/data/puc-qb/mathematics-qb.json").read_text(encoding="utf-8"))
cnt = 0
for ch in math["chapters"]:
    for q in ch["mcqs"]:
        if any(not o.strip() for i, o in enumerate(q["options"]) if not (q.get("optionImages") and q["optionImages"][i])):
            print(f"MATH EMPTY_OPT Ch{ch['chapterNumber']} Q{q['questionNumber']}: {q['question'][:80]} | opts={q['options']}")
            cnt += 1
            if cnt >= 5:
                break
    if cnt >= 5:
        break

doc_p = pymupdf.open("public/puc-papers/KSEAB_2ndPUC_Physics_Question_Bank_2025-26.pdf")
print("\n--- PHY Ch1 p6 around Q17 ---")
t = doc_p[5].get_text("text")
idx = t.find("17.")
print(t[max(0, idx-50):idx+350] if idx != -1 else "17. not on p6")

doc_c = pymupdf.open("public/puc-papers/KSEAB_2ndPUC_Chemistry_Question_Bank_2025-26.pdf")
print("\n--- CHEM Ch10 p197 ---")
print(doc_c[196].get_text("text")[:500])
