import pandas as pd
import os

def inspect_file(file_path):
    print(f"--- Inspecting {file_path} ---")
    try:
        xls = pd.ExcelFile(file_path)
        for sheet_name in xls.sheet_names:
            print(f"Sheet: {sheet_name}")
            df = pd.read_excel(xls, sheet_name=sheet_name, header=None)
            print(df.head(20))
            print("\n")
            # Break after first sheet for brevity
            break 
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_file('kcet-2023-round1-cutoffs.xlsx')
    inspect_file('kcet-2024-round1-cutoffs.xlsx')
