import json

with open('scripts/pyq_ocr_output/all_pages_raw.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Type:', type(data))
if isinstance(data, list):
    print('Total pages:', len(data))
    for i, item in enumerate(data[:15]):
        print(f"Page {item.get('page')}: text length {len(item.get('text', ''))} | Preview: {item.get('text', '')[:60].replace('\n', ' ')}")
print('Total pages in all_pages_raw.json:', len(data))
keys = [int(k) for k in data.keys()]
print('Keys range:', min(keys), 'to', max(keys))
for p in ['102', '103', '104', '105', '106', '169', '170']:
    if p in data:
        print(f"Page {p} in data: {data[p].get('text', '')[:100].replace(chr(10), ' ')}")
    else:
        print(f"Page {p} NOT in data")
