import os

files = ['p123_r.txt', 'p124_l.txt', 'p124_r.txt', 'p125_l.txt', 'p125_r.txt', 'p126_l.txt']

with open('scratch/chem9_all_dump.txt', 'w', encoding='utf-8') as out:
    for fname in files:
        fpath = os.path.join('scratch/chem9', fname)
        if os.path.exists(fpath):
            out.write(f"\n==================== {fname} ====================\n")
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                out.write(f.read())

print("Dumped all to scratch/chem9_all_dump.txt")
