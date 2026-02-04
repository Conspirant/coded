import pandas as pd
import os
import re

CATEGORY_MAPPING = {
    '1G': '1G', '1K': '1K', '1R': '1R',
    '2AG': '2AG', '2AK': '2AK', '2AR': '2AR',
    '2BG': '2BG', '2BK': '2BK', '2BR': '2BR',
    '3AG': '3AG', '3AK': '3AK', '3AR': '3AR',
    '3BG': '3BG', '3BK': '3BK', '3BR': '3BR',
    'GM': 'GM', 'GMK': 'GMK', 'GMR': 'GMR',
    'SCG': 'SCG', 'SCK': 'SCK', 'SCR': 'SCR',
    'STG': 'STG', 'STK': 'STK', 'STR': 'STR'
}

def check_file(file_path):
    print(f"--- Checking {file_path} ---")
    try:
        xls = pd.ExcelFile(file_path)
        # Check first sheet
        df = pd.read_excel(xls, sheet_name=xls.sheet_names[0], header=None)
        
        for i, row in df.iterrows():
            if i > 40: break
            row_str = " ".join([str(x) for x in row if pd.notna(x)])
            print(f"Row {i}: {row_str}")
            
            # Check for header indicators
            if ("GM" in row_str) and ("1G" in row_str or "2AG" in row_str):
                print(f"  -> Found Header match at row {i}")
            
            # Check for college code indicators
            # looking for E001 or standard codes
            if re.search(r'E\d{3}', row_str):
                 print(f"  -> Found College Code pattern at row {i}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_file('kcet-2025-round2-cutoffs.xlsx')
