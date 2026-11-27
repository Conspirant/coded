import json
from pathlib import Path

for name in ["physics", "chemistry", "mathematics"]:
    data = json.loads(Path(f"src/data/puc-qb/{name}-qb.json").read_text(encoding="utf-8"))
    print(f"=== {name.upper()} ===")
    for ch in data["chapters"]:
        cnum = ch["chapterNumber"]
        nums = sorted(q["questionNumber"] for q in ch["mcqs"])
        fnums = sorted(q["questionNumber"] for q in ch["fibs"])
        if name == "mathematics":
            all_n = sorted(nums + fnums)
            missing = [i for i in range(1, (max(all_n) if all_n else 0) + 1) if i not in all_n]
            print(f"  Ch{cnum:2d} ({ch['chapterName'][:28]:28s}): {len(nums):3d} MCQs, {len(fnums):3d} FIBs | missing: {missing[:15]}")
        else:
            missing = [i for i in range(1, (max(nums) if nums else 0) + 1) if i not in nums]
            print(f"  Ch{cnum:2d} ({ch['chapterName'][:28]:28s}): {len(nums):3d} MCQs (missing: {missing[:15]}), {len(fnums):3d} FIBs")
