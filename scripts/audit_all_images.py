import glob
import json
import os
import re

json_files = sorted(glob.glob('src/data/pyq_*.json'))

total_questions = 0
total_diagram_questions = 0
missing_images = []
duplicate_markdown_images = []
files_with_issues = set()

for jf in json_files:
    with open(jf, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f'Error reading {jf}: {e}')
            continue
            
    subj_ch = os.path.basename(jf).replace('.json', '')
    q_count = len(data)
    total_questions += q_count
    
    for idx, q in enumerate(data):
        q_num = idx + 1
        q_id = q.get('id', f'{subj_ch}-{q_num}')
        img_url = (q.get('image_url') or '').strip()
        needs_img = q.get('needs_image', False)
        q_text = q.get('question') or ''
        exp_text = q.get('explanation') or ''
        
        # Check markdown images
        md_in_q = re.findall(r'!\[.*?\]\((.*?)\)', q_text)
        md_in_exp = re.findall(r'!\[.*?\]\((.*?)\)', exp_text)
        
        if md_in_q:
            files_with_issues.add(jf)
            duplicate_markdown_images.append({
                'file': jf,
                'q_num': q_num,
                'id': q_id,
                'field': 'question',
                'md_urls': md_in_q,
                'image_url': img_url
            })
            
        if md_in_exp:
            files_with_issues.add(jf)
            duplicate_markdown_images.append({
                'file': jf,
                'q_num': q_num,
                'id': q_id,
                'field': 'explanation',
                'md_urls': md_in_exp,
                'exp_image_url': q.get('explanation_image_url', '')
            })
            
        if needs_img or img_url:
            total_diagram_questions += 1
            if img_url:
                local_path = os.path.join('public', img_url.lstrip('/\\'))
                if not os.path.exists(local_path):
                    files_with_issues.add(jf)
                    missing_images.append({
                        'file': jf,
                        'q_num': q_num,
                        'id': q_id,
                        'url': img_url,
                        'expected_path': local_path
                    })
            else:
                files_with_issues.add(jf)
                missing_images.append({
                    'file': jf,
                    'q_num': q_num,
                    'id': q_id,
                    'url': 'EMPTY',
                    'expected_path': 'needs_image is true but image_url is empty'
                })

print(f'Total JSON Files Analyzed: {len(json_files)}')
print(f'Total Questions: {total_questions}')
print(f'Total Diagram Questions: {total_diagram_questions}')
print(f'Missing Images Count: {len(missing_images)}')
for m in missing_images:
    print(f'  [MISSING] {m["file"]} Q{m["q_num"]} ({m["id"]}): {m["url"]}')

print(f'\nDuplicate/Embedded Markdown Images Count: {len(duplicate_markdown_images)}')
for d in duplicate_markdown_images:
    print(f'  [MD_IMG] {d["file"]} Q{d["q_num"]} in {d["field"]}: md={d.get("md_urls")} vs image_url={d.get("image_url")}')

print(f'\nFiles with any issues ({len(files_with_issues)}):')
for f in sorted(files_with_issues):
    print(f'  - {f}')
