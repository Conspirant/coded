import os
import glob
import json
import re

PUBLIC_DIR = os.path.abspath('public')
DATA_DIR = os.path.abspath('src/data')

def fix_all(apply_changes=False):
    json_files = sorted(glob.glob(os.path.join(DATA_DIR, 'pyq_*.json')))
    total_fixed_files = 0
    total_q_fixed = 0
    
    file_fixes = {}

    for jf in json_files:
        fname = os.path.basename(jf)
        with open(jf, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        is_list = isinstance(data, list)
        questions = data if is_list else data.get('questions', [])
        
        modified_in_file = 0
        fixes_log = []
        
        for idx, q in enumerate(questions):
            qnum = q.get('question_number', idx + 1)
            q_text = q.get('question', '') or ''
            expl_text = q.get('explanation', '') or q.get('solution', '') or ''
            iurl = q.get('image_url')
            nimg = q.get('needs_image', False)
            
            changes = []
            
            # 1. Check markdown image in question
            md_in_q = re.findall(r'!\[(.*?)\]\((.*?)\)', q_text)
            if md_in_q:
                # take first markdown image as the question's image_url
                alt, src = md_in_q[0]
                src_clean = src.strip()
                
                # Check specific known renames
                if src_clean == '/pyq_images/physics/ch17/q47_circuit.png':
                    src_clean = '/pyq_images/physics/ch17/q47_circular.png'
                
                # Check disk existence
                disk_p = os.path.join(PUBLIC_DIR, src_clean.lstrip('/').replace('/', os.sep))
                if os.path.exists(disk_p):
                    q['image_url'] = src_clean
                    q['needs_image'] = True
                    changes.append(f"Set image_url={src_clean}, needs_image=True")
                else:
                    changes.append(f"WARNING: md image {src_clean} NOT found on disk")
                
                # Remove all ![alt](src) from question text
                cleaned_q = re.sub(r'!\[.*?\]\(.*?\)', '', q_text).strip()
                # clean up multiple blank lines
                cleaned_q = re.sub(r'\n{3,}', '\n\n', cleaned_q)
                q['question'] = cleaned_q
                changes.append("Removed embedded markdown image tag from question")
            
            # 2. Check existing image_url
            if q.get('image_url'):
                current_url = q['image_url'].strip()
                # Specific known renames
                if current_url == '/pyq_images/physics/ch17/q47_circuit.png':
                    current_url = '/pyq_images/physics/ch17/q47_circular.png'
                    q['image_url'] = current_url
                    changes.append("Renamed q47_circuit.png -> q47_circular.png")
                    
                disk_p = os.path.join(PUBLIC_DIR, current_url.lstrip('/').replace('/', os.sep))
                if not os.path.exists(disk_p):
                    # In physics ch4: q7, q8, q9, q26, q29 had bogus question image_url
                    if 'physics_ch4' in fname and current_url.startswith('/pyq_images/physics/ch4/q'):
                        q['image_url'] = None
                        q['needs_image'] = False
                        changes.append(f"Cleared bogus image_url {current_url} (explanation has diagram if needed)")
                    else:
                        changes.append(f"WARNING: image_url {current_url} NOT found on disk")
                else:
                    q['needs_image'] = True
            
            # 3. Check explanation markdown images
            md_in_exp = re.findall(r'!\[(.*?)\]\((.*?)\)', expl_text)
            if md_in_exp:
                alt, src = md_in_exp[0]
                src_clean = src.strip()
                disk_p = os.path.join(PUBLIC_DIR, src_clean.lstrip('/').replace('/', os.sep))
                if os.path.exists(disk_p):
                    if not q.get('explanation_image_url'):
                        q['explanation_image_url'] = src_clean
                        changes.append(f"Set explanation_image_url={src_clean}")
            
            if changes:
                modified_in_file += 1
                total_q_fixed += 1
                fixes_log.append(f"  Q{qnum}: " + "; ".join(changes))
                
        if modified_in_file > 0:
            total_fixed_files += 1
            file_fixes[fname] = fixes_log
            if apply_changes:
                with open(jf, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"=== {'APPLIED' if apply_changes else 'DRY RUN'} IMAGE FIX RESULTS ===")
    print(f"Total files modified: {total_fixed_files}")
    print(f"Total questions modified: {total_q_fixed}")
    for fname, logs in file_fixes.items():
        print(f"\n[{fname}] ({len(logs)} changes):")
        for l in logs:
            print(l)

if __name__ == '__main__':
    fix_all(apply_changes=True)
