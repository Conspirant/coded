import json

cols = json.load(open('scratch/phys23/accurate_cols/parsed_columns.json', encoding='utf-8'))
for c in cols:
    text = '\n'.join(c['lines'])
    for word in ['figure', 'diagram', 'shown in', 'as in']:
        if word in text.lower():
            print(f"Page {c['page']} Col {c['col']}: contains '{word}'")
            for l in c['lines']:
                if word in l.lower():
                    print('   line:', l)
