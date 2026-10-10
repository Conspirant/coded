import os
import glob
import json
import re

PUBLIC_DIR = os.path.abspath('public')
DATA_DIR = os.path.abspath('src/data')

def audit():
    json_files = glob.glob(os.path.join(DATA_DIR, 'pyq_*.json'))
    
    missing_files = []
    duplicate_markdown_tags = []
    needs_image_mismatch = []
    
    for jf in json_files:
        with open(jf, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error reading {jf}: {e}")
                continue
                
        if isinstance(data, list):
            questions = data
        else:
            questions = data.get('questions', [])
        for q in questions:
            qid = q.get('id')
            qnum = q.get('question_number')
            img_url = q.get('image_url')
            needs_img = q.get('needs_image')
            q_text = q.get('question', '')
            expl_text = q.get('explanation', '') or q.get('solution', '')
            
            # Check image_url file exists
            if img_url:
                clean_path = img_url.lstrip('/').replace('/', os.sep)
                disk_path = os.path.join(PUBLIC_DIR, clean_path)
                if not os.path.isfile(disk_path):
                    missing_files.append((jf, qnum, img_url, disk_path, 'image_url missing'))
                    
            # Check markdown images in question text
            md_in_q = re.findall(r'!\[.*?\]\((.*?)\)', q_text)
            if md_in_q:
                for src in md_in_q:
                    clean_src = src.lstrip('/').replace('/', os.sep)
                    disk_path = os.path.join(PUBLIC_DIR, clean_src)
                    exists = os.path.isfile(disk_path)
                    duplicate_markdown_tags.append((jf, qnum, 'question', src, img_url, exists))
                    
            # Check markdown images in explanation
            md_in_exp = re.findall(r'!\[.*?\]\((.*?)\)', expl_text)
            if md_in_exp:
                for src in md_in_exp:
                    clean_src = src.lstrip('/').replace('/', os.sep)
                    disk_path = os.path.join(PUBLIC_DIR, clean_src)
                    exists = os.path.isfile(disk_path)
                    duplicate_markdown_tags.append((jf, qnum, 'explanation', src, img_url, exists))
                    
            # Check needs_image flag
            if needs_img and not img_url and not md_in_q:
                needs_image_mismatch.append((jf, qnum, 'needs_image=True but no image_url'))

    print(f"=== DETAILED IMAGE AUDIT RESULTS ===")
    print(f"\n1. MISSING IMAGE FILES ON DISK ({len(missing_files)}):")
    for item in missing_files:
        print(f"  [{os.path.basename(item[0])}] Q{item[1]}: {item[2]} -> file not found")
        
    print(f"\n2. EMBEDDED MARKDOWN IMAGE TAGS ({len(duplicate_markdown_tags)}):")
    # group by file
    by_file = {}
    for item in duplicate_markdown_tags:
        fname = os.path.basename(item[0])
        by_file.setdefault(fname, []).append(item)
    for fname, items in by_file.items():
        print(f"  [{fname}] ({len(items)} tags):")
        for it in items:
            print(f"     Q{it[1]} in {it[2]}: md_src='{it[3]}' | image_url='{it[4]}' | exists on disk={it[5]}")

    print(f"\n3. NEEDS_IMAGE MISMATCHES ({len(needs_image_mismatch)}):")
    for item in needs_image_mismatch:
        print(f"  [{os.path.basename(item[0])}] Q{item[1]}: {item[2]}")

if __name__ == '__main__':
    audit()
