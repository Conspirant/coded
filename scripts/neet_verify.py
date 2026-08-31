import json

# Verify medical final cutoffs
with open('neet_2026_cutoffs_medical_r1_final.json') as f:
    data = json.load(f)
print(f'Medical Final Cutoffs: {len(data)} entries')

print('\nTop 10 Most Competitive (Medical Final R1):')
header = f'{"Course Code":>12s} {"Category":>8s} {"Open":>8s} {"Close":>8s} {"Seats":>6s} | College'
print(header)
for c in data[:10]:
    name = c['college_name'][:50]
    print(f'{c["course_code"]:>12s} {c["allotted_category"]:>8s} {c["opening_rank"]:>8d} {c["closing_rank"]:>8d} {c["total_allotted"]:>6d} | {name}')

print('\n\nBottom 5 (Least Competitive):')
for c in data[-5:]:
    name = c['college_name'][:50]
    print(f'{c["course_code"]:>12s} {c["allotted_category"]:>8s} {c["opening_rank"]:>8d} {c["closing_rank"]:>8d} {c["total_allotted"]:>6d} | {name}')

# Categories breakdown
cats = {}
for c in data:
    cat = c['allotted_category']
    cats[cat] = cats.get(cat, 0) + 1
print(f'\nCategory distribution ({len(cats)} categories):')
for k, v in sorted(cats.items(), key=lambda x: -x[1])[:20]:
    print(f'  {k:>8s}: {v:>4d} entries')

# Seat types
seats = {}
for c in data:
    st = c['seat_type']
    seats[st] = seats.get(st, 0) + 1
print(f'\nSeat type distribution:')
for k, v in sorted(seats.items(), key=lambda x: -x[1]):
    print(f'  {k:>12s}: {v:>4d} entries')

# Unique colleges
colleges = set()
for c in data:
    colleges.add(c['college_code'])
print(f'\nUnique colleges: {len(colleges)}')

# Dental
print('\n' + '='*60)
with open('neet_2026_cutoffs_dental_r1_final.json') as f:
    ddata = json.load(f)
print(f'Dental Final Cutoffs: {len(ddata)} entries')
print('\nTop 5 Most Competitive (Dental Final R1):')
for c in ddata[:5]:
    name = c['college_name'][:50]
    print(f'{c["course_code"]:>12s} {c["allotted_category"]:>8s} {c["opening_rank"]:>8d} {c["closing_rank"]:>8d} {c["total_allotted"]:>6d} | {name}')

# Dental fee verification
print('\n' + '='*60)
with open('neet_2026_fee_structure_dental.json') as f:
    fees = json.load(f)
print(f'Dental Fee Structure: {len(fees)} colleges')
for f in fees[:5]:
    print(f'  [{f["college_code"]}] {f["college_name"][:45]:45s} G:{f["govt_fees"]:>7d} P:{f["private_fees"]:>7d} M:{f["management_fees"]:>7d} N:{f["nri_fees"]:>7d}')

# Mock vs Final comparison
print('\n' + '='*60)
print('Mock vs Final Comparison (Medical GM seats):')
with open('neet_2026_cutoffs_medical_r1_mock.json') as f:
    mock = json.load(f)

mock_lookup = {}
for c in mock:
    key = (c['course_code'], c['allotted_category'])
    mock_lookup[key] = c

print(f'{"Course Code":>12s} {"Cat":>5s} | {"Mock Close":>10s} {"Final Close":>11s} {"Shift":>8s}')
count = 0
for c in data:
    if c['allotted_category'] == 'GM' and c['seat_type'] == 'Government':
        key = (c['course_code'], c['allotted_category'])
        m = mock_lookup.get(key)
        if m:
            shift = c['closing_rank'] - m['closing_rank']
            sign = '+' if shift > 0 else ''
            name = c['college_name'][:40]
            print(f'{c["course_code"]:>12s} {"GM":>5s} | {m["closing_rank"]:>10d} {c["closing_rank"]:>11d} {sign}{shift:>7d} | {name}')
            count += 1
            if count >= 15:
                break
