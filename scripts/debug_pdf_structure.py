#!/usr/bin/env python3
"""Debug script to analyze 2025 PDF structure and find missing colleges."""
import pdfplumber
import re
import json
from pathlib import Path

CUTOFFS = Path('public/cutoffs')

def analyze_pdf(pdf_path):
    """Analyze a single PDF to find all college headers and their page locations."""
    results = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            words = page.extract_words()
            lines = {}
            for w in words:
                top = round(w['top'])
                if top not in lines: lines[top] = []
                lines[top].append(w['text'])
            
            for top in sorted(lines.keys()):
                line = " ".join(lines[top])
                m = re.search(r'College\s*:\s*[\(\[]?([A-Z0-9]{3,5})[\)\]]?\s*(.*)', line, re.IGNORECASE)
                if m:
                    code = m.group(1)
                    name = m.group(2).strip()
                    tables = page.find_tables()
                    results.append({
                        'page': i,
                        'code': code,
                        'name': name[:80],
                        'tables_on_page': len(tables),
                        'header_y': top,
                    })
    return results

def check_cross_page_issues(pdf_path):
    """Check for colleges whose header is on one page but data on next."""
    issues = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            words = page.extract_words()
            lines = {}
            for w in words:
                top = round(w['top'])
                if top not in lines: lines[top] = []
                lines[top].append(w['text'])
            
            has_college_header = False
            college_info = None
            for top in sorted(lines.keys()):
                line = " ".join(lines[top])
                m = re.search(r'College\s*:\s*[\(\[]?([A-Z0-9]{3,5})[\)\]]?\s*(.*)', line, re.IGNORECASE)
                if m:
                    has_college_header = True
                    college_info = (m.group(1), m.group(2)[:60])
            
            tables = page.find_tables()
            
            if has_college_header and len(tables) == 0:
                # College header on this page but no table data
                next_tables = 0
                if i+1 < len(pdf.pages):
                    next_tables = len(pdf.pages[i+1].find_tables())
                issues.append({
                    'page': i,
                    'code': college_info[0],
                    'name': college_info[1],
                    'issue': 'College header without table - data likely on next page',
                    'next_page_tables': next_tables,
                })
    return issues

# Analyze all 2025 PDFs
for pdf_file in sorted(CUTOFFS.glob('kcet-2025*.pdf')):
    print(f"\n{'='*60}")
    print(f"  {pdf_file.name}")
    print(f"{'='*60}")
    
    colleges = analyze_pdf(pdf_file)
    print(f"Total college headers found: {len(colleges)}")
    
    # Find cross-page issues
    issues = check_cross_page_issues(pdf_file)
    if issues:
        print(f"\n  ⚠️  CROSS-PAGE ISSUES ({len(issues)}):")
        for iss in issues:
            print(f"    Page {iss['page']}: {iss['code']} {iss['name']}")
            print(f"      {iss['issue']}, next page tables: {iss['next_page_tables']}")
    
    # Check for Presidency specifically
    pres = [c for c in colleges if 'presidency' in c['name'].lower() or 'presiden' in c['name'].lower()]
    if pres:
        print(f"\n  🎯 PRESIDENCY found: {pres}")
    
    # Show all unique college codes
    codes = sorted(set(c['code'] for c in colleges))
    print(f"\n  Unique college codes: {len(codes)}")

# Also count categories in a sample PDF
print(f"\n{'='*60}")
print("  CATEGORY ANALYSIS")
print(f"{'='*60}")

with pdfplumber.open(CUTOFFS / 'kcet-2025-round2-cutoffs.pdf') as pdf:
    all_cats = set()
    for page in pdf.pages[:5]:
        tables = page.find_tables()
        for t in tables:
            data = t.extract()
            for row in data:
                if row:
                    for cell in row:
                        if cell:
                            val = str(cell).strip().replace('\n','')
                            if re.match(r'^(GM|GMK|GMR|1G|1K|1R|2AG|2AK|2AR|2BG|2BK|2BR|3AG|3AK|3AR|3BG|3BK|3BR|SCG|SCK|SCR|STG|STK|STR)$', val):
                                all_cats.add(val)
    print(f"Categories found in first 5 pages: {sorted(all_cats)}")
    print(f"Count: {len(all_cats)}")
