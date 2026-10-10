import cv2
import re
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()

# 1. Parse answers from explanation text
with open('scratch/chem18/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for explanation headers like "1. (c) :", "2. (a) :", etc.
expl_answers = {}
# Regex for question explanation header: e.g. "1. (c)" or "1. (c) :" or "15. (c) :"
matches = re.findall(r'(?:^|\n)\s*(\d+)\s*[\.:\)]\s*\(([a-d])\)', text, re.IGNORECASE)
for q, a in matches:
    q_int = int(q)
    if 1 <= q_int <= 40:
        expl_answers[q_int] = a.lower()

# Also look for format "1. (c) :" where colon is inside or after
matches2 = re.findall(r'(?:^|\n)\s*(\d+)\.\s*\(([a-d])\)\s*:', text, re.IGNORECASE)
for q, a in matches2:
    q_int = int(q)
    if 1 <= q_int <= 40:
        expl_answers[q_int] = a.lower()

print(f"Found {len(expl_answers)} answers from explanation text:")
for q in sorted(expl_answers.keys()):
    print(f"Q{q}: ({expl_answers[q]})", end="  ")
    if q % 10 == 0: print()
print()

# 2. Let's crop individual table cells in answer_key.png to get 100% complete table
img = cv2.imread('scratch/chem18/answer_key.png')
# Crop table area: y=50 to 260
# 8 columns:
# x ranges: [40, 190], [190, 340], [340, 490], [490, 640], [640, 790], [790, 940], [940, 1090], [1090, 1240]
# rows: [55, 90], [90, 125], [125, 160], [160, 195], [195, 230]
cols_x = [
    (40, 190), (190, 340), (340, 490), (490, 640),
    (640, 790), (790, 940), (940, 1090), (1090, 1240)
]
rows_y = [
    (55, 92),
    (92, 126),
    (126, 160),
    (160, 195),
    (195, 230)
]

table_answers = {}
q_num = 1
for r_idx, (y1, y2) in enumerate(rows_y):
    for c_idx, (x1, x2) in enumerate(cols_x):
        if q_num > 40: break
        cell = img[y1:y2, x1:x2]
        res, _ = ocr(cell)
        cell_txt = " ".join([l[1] for l in res]) if res else ""
        # Search for (a), (b), (c), (d) or a, b, c, d
        m = re.search(r'\(([a-d])\)|(?:\.|\s|^)([a-d])(?:\.|\s|$)', cell_txt, re.IGNORECASE)
        ans = m.group(1) or m.group(2) if m else "?"
        table_answers[q_num] = (ans.lower(), cell_txt)
        q_num += 1

print("\nTable Answers:")
for q in range(1, 41):
    ans, raw = table_answers.get(q, ("?", ""))
    expl_ans = expl_answers.get(q, "?")
    match_str = "MATCH" if ans == expl_ans else f"DIFF (expl: {expl_ans})"
    print(f"Q{q:2d}: Table='{ans}' (raw: '{raw.strip()}'), Expl='{expl_ans}' -> {match_str}")
