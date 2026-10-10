import json, os, re, glob

# Load answer key
with open('scratch/phys23/answer_key_strict.json', 'r', encoding='utf-8') as f:
    ans_key = json.load(f)

print(f"Loaded answer key for {len(ans_key)} questions.")

# Let's inspect the parsed chunks
chunks = glob.glob('scratch/phys23/parsed_chunks/*.json')
for c in chunks:
    print(f"Chunk: {os.path.basename(c)} ({os.path.getsize(c)} bytes)")

# Let's print out what text is in each question chunk
q_chunks = ['p73_questions.json', 'p74_col12.json', 'p74_col34.json', 'p75_col12.json', 'p75_col3.json', 'p75_col4.json', 'p76_col12.json', 'p76_col34.json', 'p77_col12.json']

print("\n--- Inspecting question chunk contents ---")
for qc in q_chunks:
    p = os.path.join('scratch/phys23/parsed_chunks', qc)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"=== {qc} ===")
        print(content[:300])
        print("...")
