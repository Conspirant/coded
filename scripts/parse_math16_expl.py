with open("scratch/maths16/all_explanations_raw.txt", "r", encoding="utf-8") as f:
    text = f.read()

import re

out_str = ""
for q in range(1, 48):
    # Find occurrences of e.g. "\n1." or "\n1 " or "\n1."
    pattern = rf"(?:^|\n)\s*{q}\s*[\.:\)]\s*(?:\(([a-d\*])\))?\s*(.*?)(?=(?:\n\s*(?:{q+1})\s*[\.:\)])|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if m:
        opt = m.group(1)
        body = m.group(2).strip()[:120].replace('\n', ' ')
        out_str += f"Q{q} [opt={opt}]: {body}\n"
    else:
        out_str += f"Q{q}: NOT MATCHED\n"

with open("scratch/maths16/expl_parsed.txt", "w", encoding="utf-8") as out:
    out.write(out_str)

print("Saved expl_parsed.txt")
