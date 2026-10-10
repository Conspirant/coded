import json
import re

sub_map = {
    '₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4',
    '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9'
}
sup_map = {
    '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
    '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
    '⁺': '^+', '⁻': '^-'
}

def sanitize(text):
    if not text:
        return ""
    for k, v in sub_map.items():
        text = text.replace(k, v)
    for k, v in sup_map.items():
        text = text.replace(k, v)
    # convert cm^3 to \text{ cm}^3
    text = text.replace('cm^3', '\\text{ cm}^3')
    text = text.replace('dm^3', '\\text{ dm}^3')
    text = text.replace('', '')
    return text

with open('src/data/pyq_chemistry_ch1.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

for q in questions:
    q['question'] = sanitize(q['question'])
    q['options'] = [sanitize(opt) for opt in q['options']]
    q['explanation'] = sanitize(q['explanation'])

with open('src/data/pyq_chemistry_ch1.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Sanitized {len(questions)} chemistry questions successfully!")
