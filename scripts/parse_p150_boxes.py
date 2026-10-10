with open("scratch/chem16/boxes/p150_boxes.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Group boxes by approximate columns:
# x < 350: col 1 (Book page L, col 1)
# 350 <= x < 700: col 2 (Book page L, col 2)
# 700 <= x < 1050: col 3 (Book page R, col 1)
# x >= 1050: col 4 (Book page R, col 2)

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

for i, col in enumerate(cols):
    print(f"\n================ COLUMN {i+1} ================")
    for y, t in sorted(col, key=lambda it: it[0]):
        print(f"y={y:4.0f}: {t}")
