import re

with open("scratch/chem16/all_explanations.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for each question explanation in text
for q in range(1, 49):
    # Find section for Q
    pattern = rf"(?:^|\n)\s*{q}\s*[\.:\)]\s*(?:\(([a-d])\))?\s*(.*?)(?=(?:\n\s*(?:{q+1})\s*[\.:\)])|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if m:
        opt = m.group(1)
        body = m.group(2).strip()[:150].replace('\n', ' ')
        print(f"Q{q} [opt={opt}]: {body}")
    else:
        print(f"Q{q}: NOT MATCHED REGEX")
