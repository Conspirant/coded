import json
from pathlib import Path
p = Path('src/data/pyq_physics_ch28.json')
d = json.loads(p.read_text(encoding='utf-8'))
for q in d:
    if q['id'].endswith(('-020', '-030', '-034')):
        q['needs_image'] = False
        q['image_url'] = ''
        for name in ('q20_circuit.png', 'q30_circuit.png', 'q34_characteristic.png'):
            q['question'] = q['question'].replace(f'\n\n![Question figure](/pyq_images/physics/ch28/{name})', '')
p.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
