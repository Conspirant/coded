import json, re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
for path in sorted((root / 'src' / 'data').glob('pyq_*.json')):
    if path.name.endswith('_assembled.json'):
        continue
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except Exception as e:
        print(path.name, 'INVALID_JSON', e)
        continue
    if not isinstance(data, list):
        continue
    issues = []
    for i, q in enumerate(data, 1):
        if len(q.get('options', [])) != 4: issues.append(f'{i}:options')
        if q.get('correct_answer') not in (0, 1, 2, 3): issues.append(f'{i}:answer')
        if not q.get('question', '').strip(): issues.append(f'{i}:question')
        if not q.get('explanation', '').strip(): issues.append(f'{i}:explanation')
        url = q.get('image_url', '') or ''
        if url and not (root / 'public' / url.lstrip('/')).exists(): issues.append(f'{i}:image')
        if re.search(r'\b(mock|placeholder|dummy|sample)\b', json.dumps(q, ensure_ascii=False), re.I): issues.append(f'{i}:mock-text')
    print(path.name, len(data), ';'.join(issues) or 'OK')
