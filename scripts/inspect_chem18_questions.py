import re

with open('scratch/chem18/extracted_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's save a clean view of the columns
with open('scratch/chem18/clean_columns.txt', 'w', encoding='utf-8') as out:
    out.write(text)

print("Saved clean columns for Chem 18.")
