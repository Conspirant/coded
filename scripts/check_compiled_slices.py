import glob, os, re, json

slice_files = [
    "p73_c3.json", "p73_c4.json",
    "p74_c1.json", "p74_c2.json", "p74_c3.json", "p74_c4.json",
    "p75_c1.json", "p75_c2.json", "p75_c3.json", "p75_c4.json",
    "p76_c1.json", "p76_c2.json", "p76_c3.json", "p76_c4.json",
    "p77_c1.json", "p77_c2.json"
]

all_text = ""
for sf in slice_files:
    p = os.path.join("scratch/phys23/verified_slices", sf)
    with open(p, "r", encoding="utf-8") as f:
        all_text += f"\n\n=== {sf} ===\n\n" + f.read()

with open("scratch/phys23/verified_slices/compiled_slices.txt", "w", encoding="utf-8") as f:
    f.write(all_text)

print("Saved compiled_slices.txt")

# Let's check which question numbers are detected
found_q = set()
for line in all_text.split('\n'):
    m = re.search(r'(?:Q|Question\s*|\b)(\d{1,2})[\.:\)]', line)
    if m:
        val = int(m.group(1))
        if 1 <= val <= 76:
            found_q.add(val)

print(f"Detected questions: {len(found_q)} / 76: {sorted(list(found_q))}")
missing = [q for q in range(1, 77) if q not in found_q]
print(f"Missing from simple regex: {missing}")
