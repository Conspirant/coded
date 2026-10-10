import os

def parse_boxes_file(pno):
    fname = f"scratch/chem16/boxes/p{pno}_boxes.txt"
    if not os.path.exists(fname):
        return
    with open(fname, "r", encoding="utf-8") as f:
        lines = f.readlines()

    cols = [[], [], [], []]
    for l in lines:
        parts = l.strip().split("] ")
        if len(parts) == 2:
            coords = parts[0][1:].split(", ")
            y, x = float(coords[0]), float(coords[1])
            text = parts[1]
            if x < 350:
                cols[0].append((y, text))
            elif x < 700:
                cols[1].append((y, text))
            elif x < 1050:
                cols[2].append((y, text))
            else:
                cols[3].append((y, text))

    out_file = f"scratch/chem16/boxes/p{pno}_parsed_cols.txt"
    with open(out_file, "w", encoding="utf-8") as out:
        for i, col in enumerate(cols):
            out.write(f"\n================ COLUMN {i+1} ================\n")
            for y, t in sorted(col, key=lambda it: it[0]):
                out.write(f"y={y:4.0f}: {t}\n")
    print(f"Parsed {fname} -> {out_file}")

for p in [150, 151, 152, 153, 154]:
    parse_boxes_file(p)
