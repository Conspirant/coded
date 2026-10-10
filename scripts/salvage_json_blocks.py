import re
import json

def extract_json_objects(text):
    # Regex to find individual question objects
    pattern = r'\{[^{}]*"subject"[^{}]*"question"[^{}]*\}'
    matches = re.findall(pattern, text)
    valid = []
    for m in matches:
        try:
            obj = json.loads(m)
            valid.append(obj)
        except:
            pass
    return valid

# Check scratch/chem_new_slices.json
with open('scratch/chem_new_slices.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Direct valid questions in chem_new_slices:', len(data))
