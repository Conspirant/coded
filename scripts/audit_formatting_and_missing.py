import json, re
from pathlib import Path

for name in ["physics", "chemistry", "mathematics"]:
    data = json.loads(Path(f"src/data/puc-qb/{name}-qb.json").read_text(encoding="utf-8"))
    unbalanced_dollar = 0
    bare_sub_sup = 0
    empty_opt = 0
    leftover_diff = 0
    out_of_order = 0

    for ch in data["chapters"]:
        prev_n = 0
        for q in ch["mcqs"]:
            if q["questionNumber"] <= prev_n:
                out_of_order += 1
            prev_n = q["questionNumber"]
            fields = [q["question"]] + q["options"]
            for f in fields:
                # Check unbalanced $
                if len(re.findall(r"(?<!\\)\$", f)) % 2 != 0:
                    unbalanced_dollar += 1
                # Check bare _{ or ^{ outside $...$
                stripped = re.sub(r"\$[^\$]*\$", "", f)
                if re.search(r"[_^]\{", stripped):
                    bare_sub_sup += 1
                if re.search(r"(?:^|\s)\((?:Easy|Average|Difficult)\)\s*$", f):
                    leftover_diff += 1
            if any(not o.strip() for i, o in enumerate(q["options"]) if not (q.get("optionImages") and q["optionImages"][i])):
                empty_opt += 1

    print(f"FORMAT AUDIT {name}: unbalanced_$={unbalanced_dollar}, bare_sub_sup={bare_sub_sup}, empty_opt={empty_opt}, leftover_diff={leftover_diff}, out_of_order={out_of_order}")
