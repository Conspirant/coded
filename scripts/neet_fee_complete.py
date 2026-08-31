"""
Complete MBBS + Dental Fee Structure update.
- MBBS: All 68 colleges from screenshots, validated against allotment data codes
- Dental: Fix 3 missing Private/Deemed colleges (D104, D337, D664)
"""
import json
import os

ROOT = r"c:\Users\risha\OneDrive\Desktop\coded-main"

# ============================================================
# COMPLETE MBBS FEE STRUCTURE (68 colleges)
# Cross-referenced against allotment data college codes
# ============================================================

mbbs_fees = [
    # === GOVERNMENT COLLEGES (Rows 1-24) ===
    {'sl_no':1, 'college_code':'M001', 'college_name':'Bangalore Medical College,NO-2, Fort, K R ROAD,Bangalore', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':2, 'college_code':'M021', 'college_name':'Mysore Medical College,Irwin Road,Mysore', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':3, 'college_code':'M024', 'college_name':'Mandya Institute of Medical Sciences,District Hospital,Mandya', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':4, 'college_code':'M025', 'college_name':'Hassan Institute of Medical Sciences,Near Chamarajendra Hospital,Hassan', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':5, 'college_code':'M031', 'college_name':'Karnataka Institute of Medical Sciences,Vidyanagar,Hubli', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':6, 'college_code':'M037', 'college_name':'Belgaum Institute of Medical Sciences,Dr B R Ambedkar Road,Belgaum', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':7, 'college_code':'M041', 'college_name':'Vijayanagar Institute of Medical Sciences,Cantonment,Bellary', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':8, 'college_code':'M044', 'college_name':'Bidar Institute of Medical Sciences,Udgir Road,Bidar', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':9, 'college_code':'M045', 'college_name':'Raichur Institute of Medical Sciences,Sy No 307 & 308,Raichur', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':10, 'college_code':'M063', 'college_name':'Shimoga Institute of Medical Sciences,Sagar Road,Shimoga', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':11, 'college_code':'M066', 'college_name':'ESI Medical College,Rajajinagar,Bangalore', 'college_type':'Government', 'govt_fees':109350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':12, 'college_code':'M070', 'college_name':'ESI Medical College,Sedam Road,Gulbarga', 'college_type':'Government', 'govt_fees':109350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':13, 'college_code':'M072', 'college_name':'Gulbarga Institute of Medical Sciences,VIRESHNAGAR SEDAM ROAD,GULBARGA', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':14, 'college_code':'M073', 'college_name':'Koppal Institute of Medical Sciences,GANGAVATI ROAD,KIDDIDAL GATE,KOPPAL', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':15, 'college_code':'M074', 'college_name':'K.H. Patil Institute of Medical Sciences,Malusamudra, Mulugund Road,Gadag', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':16, 'college_code':'M075', 'college_name':'Chamarajanagar Institute of Medical Science,SURVEY NO 124,YADAPURA CHAMARAJANAGAR', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    # Row 17 - was not visible in first screenshot, filled from allotment data code M076
    {'sl_no':17, 'college_code':'M076', 'college_name':'Karwar Institute of Medical Science,M G ROAD,UTTARA KANNADA', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':18, 'college_code':'M077', 'college_name':'Kodagu Institute of Medical Sciences,MADIKERI', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':19, 'college_code':'M082', 'college_name':'Shri Atal Bihari Vajpayee Institute of Medical Sciences,Bengaluru', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':20, 'college_code':'M084', 'college_name':'Nandi Medical College and Research Institute Chikkaballapura', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':2509350, 'nri_fees':2509350, 'course':'MBBS'},
    {'sl_no':21, 'college_code':'M085', 'college_name':'Chikkamagaluru Institute of Medical Sciences,Chikkamagaluru', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':22, 'college_code':'M086', 'college_name':'Haveri Institute of Medical Sciences,Haveri', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':23, 'college_code':'M087', 'college_name':'Yadgir Institute of Medical Sciences,Yadgiri', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':24, 'college_code':'M092', 'college_name':'Chitradurga Medical College and Research Institute,Chitradurga', 'college_type':'Government', 'govt_fees':64350, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},

    # === MINORITY (L,R) COLLEGES (Rows 25-38) ===
    {'sl_no':25, 'college_code':'M008', 'college_name':'M.V.J Medical College and Research Hospital,NH-4, Dandupalya, Kolathur,Channasamdra,Bangalore', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':4011950, 'nri_fees':4011950, 'course':'MBBS'},
    {'sl_no':26, 'college_code':'M009', 'college_name':'Vydehi Institute of Medical Sciences and Research Centre,No.82, EPIP Area, Nallurahalli,Bangalore', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':4411950, 'nri_fees':4411950, 'course':'MBBS'},
    {'sl_no':27, 'college_code':'M010', 'college_name':'A.J. Institute of Medical Sciences,NH-66, Kuntikana,Mangalore', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':4011950, 'nri_fees':4011950, 'course':'MBBS'},
    {'sl_no':28, 'college_code':'M011', 'college_name':'St John Medical College,Bangalore', 'college_type':'Minority (L,R)', 'govt_fees':0, 'private_fees':810535, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':29, 'college_code':'M033', 'college_name':'Al-Ameen Medical College,ADMINISTRATIVE BLOCK,VIJAYAPUR', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2911950, 'nri_fees':2911950, 'course':'MBBS'},
    {'sl_no':30, 'college_code':'M043', 'college_name':'Navodaya Medical College,PB No.26, Navodaya Nagar,Raichur', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2736950, 'nri_fees':2736950, 'course':'MBBS'},
    {'sl_no':31, 'college_code':'M050', 'college_name':'Father Muller Institute of Med. Education & Research,Father Muller Road,Mangalore', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3611950, 'nri_fees':3611950, 'course':'MBBS'},
    {'sl_no':32, 'college_code':'M067', 'college_name':'Subbaiah Institute of Medical Science,NH-13, Purle,Shimoga', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2711950, 'nri_fees':2711950, 'course':'MBBS'},
    {'sl_no':33, 'college_code':'M071', 'college_name':'The Oxford Medical College Hospital and Research Center,Yadavanahalli, Attibele Hobli,Bangalore', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3411950, 'nri_fees':3411950, 'course':'MBBS'},
    {'sl_no':34, 'college_code':'M078', 'college_name':'Akash Institute of Medical Sciences and Research Centre,DEVANAHALLI,BANGALORE', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3611950, 'nri_fees':3611950, 'course':'MBBS'},
    {'sl_no':35, 'college_code':'M079', 'college_name':'Kanachur Institute of Medical Sciences and Research Centre,UNIVERSITY ROAD,MANGALORE', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2861950, 'nri_fees':2861950, 'course':'MBBS'},
    {'sl_no':36, 'college_code':'M088', 'college_name':'G R Medical College Hospital and Research Centre Mangalore D.K', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2711950, 'nri_fees':2711950, 'course':'MBBS'},
    {'sl_no':37, 'college_code':'M091', 'college_name':'SRI CHAMUNDESHWARI MEDICAL COLLEGE, HOSPITAL AND RESEARCH INST.,CHANNAPATNA, RAMANAGARA', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3101950, 'nri_fees':3101950, 'course':'MBBS'},
    {'sl_no':38, 'college_code':'M098', 'college_name':'ALVAS INSTITUTE OF MEDICAL SCIENCES AND RESEARCH CENTRE, DK', 'college_type':'Minority (L,R)', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2511950, 'nri_fees':2511950, 'course':'MBBS'},

    # === PRIVATE UNAIDED COLLEGES (Rows 39-51) ===
    {'sl_no':39, 'college_code':'M002', 'college_name':'Dr. B.R. Ambedkar Medical College,Kadugondanahalli,Bangalore', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3611950, 'nri_fees':3611950, 'course':'MBBS'},
    {'sl_no':40, 'college_code':'M003', 'college_name':'Kempegowda Institute of Medical Sciences,B.S.K II Stage,Bangalore', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':4311950, 'nri_fees':4311950, 'course':'MBBS'},
    {'sl_no':41, 'college_code':'M035', 'college_name':'S. Nijalingappa Medical College and Research Centre,Bagalkot', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3361950, 'nri_fees':3361950, 'course':'MBBS'},
    {'sl_no':42, 'college_code':'M042', 'college_name':'Mahadevappa Rampure Medical College,Mahadevappa Rampure Marg,Kalaburgi', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3911950, 'nri_fees':3911950, 'course':'MBBS'},
    {'sl_no':43, 'college_code':'M054', 'college_name':'K.Venkataramana Gowda Medical College and Hospital,Kurunjibagh, Dakshina Kannada', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':2634214, 'nri_fees':2634214, 'course':'MBBS'},
    {'sl_no':44, 'college_code':'M061', 'college_name':'Jaya Jagadguru Murugharajendra Medical College,Davangere District', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3911950, 'nri_fees':3611950, 'course':'MBBS'},
    {'sl_no':45, 'college_code':'M062', 'college_name':'Shymanuru Shivashankarappa Institute Of Medical Sciences,Jnanashankara, NH-4,Davangere', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3611950, 'nri_fees':3611950, 'course':'MBBS'},
    {'sl_no':46, 'college_code':'M068', 'college_name':'BGS Global Institute of Medical Sciences,# 67, BGS Health & Education,Kengeri,Bangalore', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':4211950, 'nri_fees':4211950, 'course':'MBBS'},
    {'sl_no':47, 'college_code':'M069', 'college_name':'Shridevi Institute of Medical Sciences and Research Hospital,Sira Road,Tumkur', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3341950, 'nri_fees':3341950, 'course':'MBBS'},
    {'sl_no':48, 'college_code':'M081', 'college_name':'East Point College of Medical Sciences and Research Center,Bangalore', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3711950, 'nri_fees':3711950, 'course':'MBBS'},
    {'sl_no':49, 'college_code':'M090', 'college_name':'Siddaganga Medical College and Research Institute,Tumakuru', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3011950, 'nri_fees':3011950, 'course':'MBBS'},
    {'sl_no':50, 'college_code':'M096', 'college_name':'S R Patil Medical College Hospital and Research Center,Badagud,BAGALKOT', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3611950, 'nri_fees':3611950, 'course':'MBBS'},
    {'sl_no':51, 'college_code':'M097', 'college_name':'Farooqia Academy of Medical Education Hospital and Research Institute,Mysore Mediker Road,Mysore District', 'college_type':'Private UnAided', 'govt_fees':153571, 'private_fees':1200117, 'management_fees':3311950, 'nri_fees':3311950, 'course':'MBBS'},

    # === PRIVATE / DEEMED UNIVERSITY COLLEGES (Rows 52-68) ===
    {'sl_no':52, 'college_code':'M004', 'college_name':'M.S.Ramaiah Medical College,MSR Nagar, MSRIT Post,Bangalore', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2515000, 'management_fees':4500000, 'nri_fees':4500000, 'course':'MBBS'},
    {'sl_no':53, 'college_code':'M005', 'college_name':'Khaja Bande Navaz Institute Of Medical Sciences,Rouza Buzurg,Gulbarga', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':1329965, 'management_fees':3215000, 'nri_fees':3215000, 'course':'MBBS'},
    {'sl_no':54, 'college_code':'M020', 'college_name':'Sri Basaveshwara Medical College and Hospital,NH-4, S.J.M.I.T Campus,Chitradurga', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2285000, 'management_fees':3470000, 'nri_fees':3470000, 'course':'MBBS'},
    {'sl_no':55, 'college_code':'M022', 'college_name':'Jagadguru Sri Shivarathreeshwara Medical College,Sri Shivarathreeshwara Nagar,Mysore', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2215000, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':56, 'college_code':'M023', 'college_name':'Adichunchanagiri Institute of Medical Sciences,B.G Nagar,Bellur', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2215000, 'management_fees':3515000, 'nri_fees':3515000, 'course':'MBBS'},
    {'sl_no':57, 'college_code':'M032', 'college_name':'Jawaharlal Nehru Medical College,Nehru Nagar,Belgaum', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':58, 'college_code':'M036', 'college_name':'SDM College of Medical Sciences and Hospital,Manjushree Nagar, PB ROAD,Dharwad', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2015000, 'management_fees':0, 'nri_fees':3615000, 'course':'MBBS'},
    {'sl_no':59, 'college_code':'M051', 'college_name':'Kasturba Medical College,PB No.53,Hampankatta,Mangalore', 'college_type':'Private/Deemed University', 'govt_fees':153571, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':60, 'college_code':'M052', 'college_name':'Yenepoya Medical College,University Road, Nithyananda,Mangalore', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':61, 'college_code':'M053', 'college_name':'K.S.Hegde Medical Academy,Nithyananda Nagar,Mangalore', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':62, 'college_code':'M064', 'college_name':'Sapthagiri Institute of Medical Sciences,No.15, Chikkasandra,Bangalore', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2240750, 'management_fees':4500000, 'nri_fees':4500000, 'course':'MBBS'},
    {'sl_no':63, 'college_code':'M065', 'college_name':'Srinivasa Institute of Medical Research Center Srinivas Nagar,Mangalore', 'college_type':'Private/Deemed University', 'govt_fees':166621, 'private_fees':2225000, 'management_fees':2975000, 'nri_fees':2975000, 'course':'MBBS'},
    {'sl_no':64, 'college_code':'M083', 'college_name':'Dr. Chandramma Dayananda Sagar Institute of Medical Education,Harohalli Inst, Kanakapura Rd', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2215000, 'management_fees':4015000, 'nri_fees':4015000, 'course':'MBBS'},
    {'sl_no':65, 'college_code':'M089', 'college_name':'Jagadguru Gangadhar Mahaswamiji Mooresavirmath Medical College,Dharwad', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2215000, 'management_fees':4015000, 'nri_fees':4015000, 'course':'MBBS'},
    {'sl_no':66, 'college_code':'M093', 'college_name':'Sri Madhusudan Sai Institute of Medical Sciences,Molanahalli,CHIKKABALLAPURA', 'college_type':'Private/Deemed University', 'govt_fees':606084, 'private_fees':0, 'management_fees':0, 'nri_fees':0, 'course':'MBBS'},
    {'sl_no':67, 'college_code':'M094', 'college_name':'PES University Institute of Medical Sciences and Research,Electronic City,BANGALORE', 'college_type':'Private/Deemed University', 'govt_fees':0, 'private_fees':2200000, 'management_fees':4500000, 'nri_fees':4500000, 'course':'MBBS'},
    {'sl_no':68, 'college_code':'M095', 'college_name':'BGS Medical College and Hospital,BANGALORE', 'college_type':'Private/Deemed University', 'govt_fees':156621, 'private_fees':2215000, 'management_fees':3915000, 'nri_fees':3515000, 'course':'MBBS'},
]

# Save MBBS fees
path = os.path.join(ROOT, 'neet_2026_fee_structure_mbbs.json')
with open(path, 'w', encoding='utf-8') as f:
    json.dump(mbbs_fees, f, indent=2, ensure_ascii=False)
print(f"MBBS fees: {len(mbbs_fees)} colleges saved to {os.path.basename(path)} ({os.path.getsize(path)/1024:.1f}KB)")

# ============================================================
# FIX DENTAL FEE STRUCTURE (add 3 missing Private/Deemed)
# ============================================================

dental_path = os.path.join(ROOT, 'neet_2026_fee_structure_dental.json')
with open(dental_path, 'r', encoding='utf-8') as f:
    dental_fees = json.load(f)

# Check if the 3 missing colleges are already there
existing_codes = {c['college_code'] for c in dental_fees}
missing_dental = []

if 'D104' not in existing_codes:
    missing_dental.append({'sl_no':37, 'college_code':'D104', 'college_name':'M.S.Ramaiah University of Applied Sciences,MSR Nagar,Bangalore', 'college_type':'Private/Deemed University', 'govt_fees':95308, 'private_fees':654650, 'management_fees':1004650, 'nri_fees':1004650, 'course':'BDS'})
if 'D337' not in existing_codes:
    missing_dental.append({'sl_no':38, 'college_code':'D337', 'college_name':'Sri Dharmasthala Manjunatheswara Dental College,Dhavalanagar,Dharwad', 'college_type':'Private/Deemed University', 'govt_fees':95308, 'private_fees':551950, 'management_fees':681950, 'nri_fees':786950, 'course':'BDS'})
if 'D664' not in existing_codes:
    missing_dental.append({'sl_no':39, 'college_code':'D664', 'college_name':'Sri Jagadguru Murugharajendra Dental College & Hospital,P B Road,Chitradurga', 'college_type':'Private/Deemed University', 'govt_fees':95308, 'private_fees':411950, 'management_fees':411950, 'nri_fees':411950, 'course':'BDS'})

if missing_dental:
    dental_fees.extend(missing_dental)
    with open(dental_path, 'w', encoding='utf-8') as f:
        json.dump(dental_fees, f, indent=2, ensure_ascii=False)
    print(f"Dental fees: Added {len(missing_dental)} missing colleges -> now {len(dental_fees)} total")
else:
    print(f"Dental fees: All {len(dental_fees)} colleges already present")

# ============================================================
# REGENERATE COMBINED FEE FILE
# ============================================================

all_fees = dental_fees + mbbs_fees
all_path = os.path.join(ROOT, 'neet_2026_fee_structure_all.json')
with open(all_path, 'w', encoding='utf-8') as f:
    json.dump(all_fees, f, indent=2, ensure_ascii=False)
print(f"Combined fees: {len(all_fees)} colleges saved ({os.path.getsize(all_path)/1024:.1f}KB)")

# ============================================================
# VALIDATION: Cross-reference against allotment data
# ============================================================
print(f"\n{'='*60}")
print("VALIDATION: Cross-referencing fee codes against allotment data")

allot_path = os.path.join(ROOT, 'neet_2026_allotment_medical_r1_final.json')
with open(allot_path, 'r', encoding='utf-8') as f:
    allotments = json.load(f)

allot_codes = {}
for r in allotments:
    cc = r['college_code']
    if cc not in allot_codes:
        allot_codes[cc] = r['college_name']

fee_codes = {c['college_code'] for c in mbbs_fees}

# Check for fee codes not in allotment data
missing_in_allot = fee_codes - set(allot_codes.keys())
if missing_in_allot:
    print(f"\n  WARNING: {len(missing_in_allot)} fee codes NOT found in allotment data:")
    for c in sorted(missing_in_allot):
        match = [x for x in mbbs_fees if x['college_code'] == c]
        if match:
            print(f"    {c}: {match[0]['college_name'][:60]}")
else:
    print(f"\n  ✓ All {len(fee_codes)} fee college codes found in allotment data!")

# Check for allotment codes not in fee data
missing_in_fees = set(allot_codes.keys()) - fee_codes
if missing_in_fees:
    print(f"\n  INFO: {len(missing_in_fees)} allotment codes NOT in fee data:")
    for c in sorted(missing_in_fees):
        print(f"    {c}: {allot_codes[c][:60]}")
else:
    print(f"\n  ✓ All allotment codes have fee data!")

# Check for duplicate codes in fee data
from collections import Counter
code_counts = Counter(c['college_code'] for c in mbbs_fees)
dupes = {k: v for k, v in code_counts.items() if v > 1}
if dupes:
    print(f"\n  WARNING: Duplicate codes in fee data: {dupes}")
else:
    print(f"\n  ✓ No duplicate college codes!")

# Summary stats
print(f"\n{'='*60}")
print("FEE STRUCTURE SUMMARY:")
types = {}
for c in mbbs_fees:
    ct = c['college_type']
    types[ct] = types.get(ct, 0) + 1
for t, count in sorted(types.items()):
    print(f"  {t:30s}: {count} colleges")

# Fee ranges by type
for ct in sorted(types.keys()):
    colleges = [c for c in mbbs_fees if c['college_type'] == ct]
    govt = [c['govt_fees'] for c in colleges if c['govt_fees'] > 0]
    pvt = [c['private_fees'] for c in colleges if c['private_fees'] > 0]
    mgmt = [c['management_fees'] for c in colleges if c['management_fees'] > 0]
    print(f"\n  {ct}:")
    if govt: print(f"    Govt fees:  ₹{min(govt):,} - ₹{max(govt):,}")
    if pvt:  print(f"    Pvt fees:   ₹{min(pvt):,} - ₹{max(pvt):,}")
    if mgmt: print(f"    Mgmt fees:  ₹{min(mgmt):,} - ₹{max(mgmt):,}")
