with open('scratch/math18/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Find text of page 231
p231_idx = text.find('Page 231')
if p231_idx != -1:
    print(text[p231_idx:p231_idx+5000].encode('ascii', 'replace').decode('ascii'))
