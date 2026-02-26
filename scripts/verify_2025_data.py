import json
import random

def verify_data():
    with open('cutoff_2025_extracted.json', 'r') as f:
        data = json.load(f)
        
    print(f"Total Rows: {len(data)}")
    
    # 1. Check E001 (UVCE) Round 2
    uvce_r2 = [x for x in data if x['college_code'] == 'E001' and x['round'] == 2]
    print(f"\nE001 (UVCE) Round 2 Rows: {len(uvce_r2)}")
    if uvce_r2:
        print("Sample Row (First):")
        print(json.dumps(uvce_r2[0], indent=2))
        
    # 2. Check E097 (Presidency) Round 2
    pres_r2 = [x for x in data if x['college_code'] == 'E097' and x['round'] == 2]
    print(f"\nE097 (Presidency) Round 2 Rows: {len(pres_r2)}")
    if pres_r2:
        print("Sample Row (First):")
        print(json.dumps(pres_r2[0], indent=2))
        
    # 3. Check for specific known issue: Multi-line course names
    # Find a course name that is long
    long_courses = [x for x in data if len(x['raw_course_text']) > 50]
    print(f"\nLong Course Names Count: {len(long_courses)}")
    if long_courses:
        print(f"Sample Long Course: {long_courses[0]['raw_course_text']}")
        
    # 4. Data Type Check
    # Ensure cutoffs are int or None
    bad_type = [x for x in data if any(k in x and x[k] is not None and not isinstance(x[k], int) for k in ['1G', 'GM'])]
    print(f"\nRows with Bad Data Types: {len(bad_type)}")

if __name__ == "__main__":
    verify_data()
