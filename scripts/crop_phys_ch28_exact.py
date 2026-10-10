import json
from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]
pdf = pdfium.PdfDocument(str(root / 'KCET Chapterwise PYQ 2006-24.pdf'))
out = root / 'public' / 'pyq_images' / 'physics' / 'ch28'
out.mkdir(parents=True, exist_ok=True)

# Source-page crops are kept as question-level snippets, preserving the printed
# circuit/graph and its labels exactly as scanned in the supplied PDF.
crops = {
    'q7_circuit.png': (99, (760, 180, 1520, 550)),
    'q20_circuit.png': (100, (760, 350, 1520, 850)),
    'q30_circuit.png': (100, (0, 500, 760, 1000)),
    'q34_characteristic.png': (100, (760, 650, 1520, 1040)),
}
for name, (page_no, box) in crops.items():
    image = pdf[page_no - 1].render(scale=2.5).to_pil()
    image.crop(box).save(out / name, quality=95)

data_path = root / 'src' / 'data' / 'pyq_physics_ch28.json'
data = json.loads(data_path.read_text(encoding='utf-8'))
mapping = {7: 'q7_circuit.png'}
for q in data:
    number = int(q['id'].rsplit('-', 1)[1])
    if number in mapping:
        url = f"/pyq_images/physics/ch28/{mapping[number]}"
        q['needs_image'] = True
        q['image_url'] = url
        if '![' not in q['question']:
            q['question'] += f"\n\n![Question figure]({url})"
data_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print('Cropped and linked:', ', '.join(mapping.values()))
