#!/usr/bin/env python3
"""
KCET Excel Cutoff Extractor
Extracts cutoff data from KCET Excel files (2023, 2024, 2025) with proper handling of different formats
"""

import pandas as pd
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Comprehensive college mapping with accurate details
COLLEGE_MAPPING = {
    'E001': 'University of Visvesvaraya College of Engineering Bangalore ( PUBLIC UNIV. )',
    'E002': 'S K S J T Institute of Engineering Bangalore ( PUBLIC UNIV. )',
    'E003': 'B M S College of Engineering Basavanagudi, Bangalore ( PUBLIC UNIV. )',
    'E004': 'Dr. Ambedkar Institute Of Technology Bangalore ( PUBLIC UNIV. )',
    'E005': 'R. V. College of Engineering Bangalore ( PUBLIC UNIV. )',
    'E006': 'P E S University Bangalore ( PUBLIC UNIV. )',
    'E007': 'B M S Institute of Technology and Management Bangalore ( PUBLIC UNIV. )',
    'E008': 'M S Ramaiah Institute of Technology Bangalore ( PUBLIC UNIV. )',
    'E009': 'Bangalore Institute of Technology Bangalore ( PUBLIC UNIV. )',
    'E010': 'P E S Institute of Technology Bangalore ( PUBLIC UNIV. )',
    'E011': 'Dayananda Sagar College of Engineering Bangalore ( PUBLIC UNIV. )',
    'E012': 'S J C Institute of Technology Chikkaballapur ( PUBLIC UNIV. )',
    'E013': 'Bapuji Institute of Engineering and Technology Davangere ( PUBLIC UNIV. )',
    'E014': 'S D M College of Engineering and Technology Dharwad ( PUBLIC UNIV. )',
    'E015': 'B V B College of Engineering and Technology Hubli ( PUBLIC UNIV. )',
    'E016': 'K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E017': 'K L E Society\'s College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E018': 'Basaveshwar Engineering College Bagalkot ( PUBLIC UNIV. )',
    'E019': 'Gogte Institute of Technology Belgaum ( PUBLIC UNIV. )',
    'E020': 'K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E021': 'K L E Society\'s B V B College of Engineering and Technology Hubli ( PUBLIC UNIV. )',
    'E022': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E023': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E024': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E025': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E026': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E027': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E028': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E029': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E030': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E031': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E032': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E033': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E034': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E035': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E036': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E037': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E038': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E039': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E040': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E041': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E042': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E043': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E044': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E045': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E046': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E047': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E048': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E049': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E050': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E051': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E052': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E053': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E054': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E055': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E056': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E057': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E058': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E059': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E060': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E061': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E062': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E063': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E064': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E065': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E066': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E067': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E068': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E069': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E070': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E071': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E072': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E073': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E074': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E075': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E076': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E077': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E078': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E079': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E080': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E081': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E082': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E083': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E084': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E085': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E086': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E087': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E088': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E089': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E090': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E091': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E092': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E093': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E094': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E095': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E096': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E097': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E098': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
    'E099': 'K L E Society\'s K L E Dr. M S Sheshgiri College of Engineering and Technology Belgaum ( PUBLIC UNIV. )',
    'E100': 'K L E Society\'s K L E Institute of Technology Hubli ( PUBLIC UNIV. )',
}

# Comprehensive branch mapping
BRANCH_MAPPING = {
    'CIVIL ENGINEERING': 'CE',
    'COMPUTER SCIENCE AND ENGINEERING': 'CS',
    'ELECTRICAL & ELECTRONICS ENGINEERING': 'EE',
    'ELECTRONICS AND COMMUNICATION ENGG': 'EC',
    'INFORMATION SCIENCE AND ENGINEERING': 'IE',
    'MECHANICAL ENGINEERING': 'ME',
    'CHEMICAL ENGINEERING': 'CH',
    'BIOTECHNOLOGY': 'BT',
    'INDUSTRIAL ENGINEERING AND MANAGEMENT': 'IM',
    'TELECOMMUNICATION ENGINEERING': 'TC',
    'INSTRUMENTATION TECHNOLOGY': 'IT',
    'MEDICAL ELECTRONICS': 'MD',
    'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)': 'CA',
    'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)': 'DS',
    'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': 'CY',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
    'ROBOTICS AND AUTOMATION': 'RA',
    'AEROSPACE ENGINEERING': 'SE',
    'AUTOMATION AND ROBOTICS ENGINEERING': 'RO',
    'COMPUTER SCIENCE AND BUSINESS SYSTEMS': 'CB',
    'ELECTRONICS AND COMMUNICATION ENGINEERING': 'EC',
    'ELECTRICAL AND ELECTRONICS ENGINEERING': 'EE',
    'COMPUTER SCIENCE ENGINEERING': 'CS',
    'MECHANICAL ENGINEERING': 'ME',
    'CIVIL ENGINEERING': 'CE',
    'INFORMATION SCIENCE ENGINEERING': 'IE',
    'BIOTECHNOLOGY ENGINEERING': 'BT',
    'CHEMICAL ENGINEERING': 'CH',
    'INDUSTRIAL ENGINEERING': 'IM',
    'TELECOMMUNICATION ENGINEERING': 'TC',
    'INSTRUMENTATION ENGINEERING': 'IT',
    'MEDICAL ELECTRONICS ENGINEERING': 'MD',
    'COMPUTER SCIENCE AND ENGINEERING (AI & ML)': 'CA',
    'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)': 'DS',
    'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': 'CY',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING ENGINEERING': 'AI',
    'ROBOTICS AND AUTOMATION ENGINEERING': 'RA',
    'AEROSPACE ENGINEERING': 'SE',
    'AUTOMATION AND ROBOTICS ENGINEERING': 'RO',
    'COMPUTER SCIENCE AND BUSINESS SYSTEMS ENGINEERING': 'CB',
}

# Category mapping
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

def extract_college_info(df: pd.DataFrame, filename: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract college code and name from the dataframe"""
    college_code = None
    college_name = None
    
    # Look for college information in the first few rows
    for i in range(min(10, len(df))):
        row = df.iloc[i]
        for col in df.columns:
            cell_value = str(row[col]).strip()
            if pd.isna(cell_value) or cell_value == 'nan':
                continue
                
            # Pattern for college code and name
            college_match = re.search(r'College:\s*(E\d{3})\s*(.+?)(?:\s*\(|$)', cell_value, re.IGNORECASE)
            if college_match:
                college_code = college_match.group(1)
                college_name = college_match.group(2).strip()
                logger.info(f"Found college: {college_code} - {college_name}")
                return college_code, college_name
    
    # If not found in first 10 rows, search entire dataframe
    for i in range(len(df)):
        row = df.iloc[i]
        for col in df.columns:
            cell_value = str(row[col]).strip()
            if pd.isna(cell_value) or cell_value == 'nan':
                continue
                
            college_match = re.search(r'College:\s*(E\d{3})\s*(.+?)(?:\s*\(|$)', cell_value, re.IGNORECASE)
            if college_match:
                college_code = college_match.group(1)
                college_name = college_match.group(2).strip()
                logger.info(f"Found college: {college_code} - {college_name}")
                return college_code, college_name
    
    logger.warning(f"Could not extract college info from {filename}")
    return None, None

def find_header_row(df: pd.DataFrame) -> Optional[int]:
    """Find the header row containing category information"""
    for i in range(len(df)):
        row = df.iloc[i]
        first_cell = str(row.iloc[0]).strip()
        if first_cell.lower() in ['course name', 'course', 'branch', 'branch name']:
            logger.info(f"Found header row at index {i}")
            return i
    return None

def map_branch(course_name: str) -> Optional[str]:
    """Map course name to branch code"""
    course_upper = course_name.upper().strip()
    
    # Direct match
    if course_upper in BRANCH_MAPPING:
        return BRANCH_MAPPING[course_upper]
    
    # Partial matching
    for key, value in BRANCH_MAPPING.items():
        if key in course_upper or course_upper in key:
            return value
    
    # Handle common variations
    variations = {
        'CSE': 'CS',
        'COMPUTER SCIENCE': 'CS',
        'COMPUTER': 'CS',
        'ECE': 'EC',
        'ELECTRONICS': 'EC',
        'MECH': 'ME',
        'MECHANICAL': 'ME',
        'CIVIL': 'CE',
        'IT': 'IE',
        'INFORMATION TECHNOLOGY': 'IE',
        'INFORMATION SCIENCE': 'IE',
        'ELECTRICAL': 'EE',
        'BIO': 'BT',
        'BIOTECH': 'BT',
        'CHEMICAL': 'CH',
        'TELECOM': 'TC',
        'INSTRUMENTATION': 'IT',
        'MEDICAL': 'MD',
        'AI': 'AI',
        'ARTIFICIAL INTELLIGENCE': 'AI',
        'MACHINE LEARNING': 'AI',
        'ROBOTICS': 'RA',
        'AUTOMATION': 'RA',
        'AEROSPACE': 'SE',
        'BUSINESS SYSTEMS': 'CB',
        'CYBER': 'CY',
        'DATA SCIENCE': 'DS',
        'DATA': 'DS'
    }
    
    for variation, code in variations.items():
        if variation in course_upper:
            return code
    
    logger.warning(f"Unknown course: {course_name}")
    return None

def determine_round(filename: str) -> str:
    """Determine round from filename"""
    filename_lower = filename.lower()
    if 'round1' in filename_lower:
        return 'R1'
    elif 'round2' in filename_lower:
        return 'R2'
    elif 'round3' in filename_lower or 'extended' in filename_lower:
        return 'EXT'
    elif 'mock' in filename_lower:
        return 'MOCK'
    else:
        return 'R1'

def parse_excel_file(df: pd.DataFrame, year: str, source: str) -> List[Dict[str, Any]]:
    """Parse Excel file and extract cutoff data"""
    results = []
    
    # Extract college info
    college_code, college_name = extract_college_info(df, source)
    if not college_code:
        return results
    
    # Find header row
    header_row_idx = find_header_row(df)
    if header_row_idx is None:
        logger.warning(f"Could not find header row in {source}")
        return results
    
    header_row = df.iloc[header_row_idx]
    
    # Map category columns
    category_columns = {}
    for i, col in enumerate(df.columns):
        if i == 0:  # Skip first column (course names)
            continue
        category = str(header_row.iloc[i]).strip()
        if category in CATEGORY_MAPPING:
            category_columns[i] = CATEGORY_MAPPING[category]
    
    # Determine round from filename
    round_type = determine_round(source)
    
    # Process data rows
    for i in range(header_row_idx + 1, len(df)):
        row = df.iloc[i]
        course_name = str(row.iloc[0]).strip()
        
        if pd.isna(course_name) or course_name == 'nan' or course_name.lower() in ['course name', 'course', '--', '']:
            continue
        
        # Map branch
        branch_code = map_branch(course_name)
        if not branch_code:
            continue
        
        # Extract closing ranks for each category
        for col_idx, category in category_columns.items():
            cell_value = row.iloc[col_idx]
            
            # Handle different data types
            if pd.isna(cell_value):
                continue
                
            try:
                closing_rank = float(cell_value)
                if closing_rank > 0 and closing_rank < 200000:  # Reasonable range
                    results.append({
                        'institute': COLLEGE_MAPPING.get(college_code, f'College {college_code}'),
                        'institute_code': college_code,
                        'course': branch_code,
                        'category': category,
                        'cutoff_rank': int(closing_rank),
                        'year': year,
                        'round': round_type
                    })
            except (ValueError, TypeError):
                continue
    
    return results

def extract_from_excel(file_path: str) -> List[Dict[str, Any]]:
    """Extract cutoff data from Excel file"""
    try:
        logger.info(f"Processing: {os.path.basename(file_path)}")
        
        # Read Excel file
        excel_file = pd.ExcelFile(file_path)
        all_results = []
        
        # Detect year from filename
        year_match = re.search(r'20\d{2}', os.path.basename(file_path))
        year = year_match.group(0) if year_match else str(pd.Timestamp.now().year)
        
        for sheet_name in excel_file.sheet_names:
            logger.info(f"Processing sheet: {sheet_name}")
            
            # Read sheet
            df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)
            
            if df.empty:
                continue
            
            # Parse the sheet
            results = parse_excel_file(df, year, os.path.basename(file_path))
            all_results.extend(results)
        
        logger.info(f"Extracted {len(all_results)} records from {os.path.basename(file_path)}")
        return all_results
        
    except Exception as e:
        logger.error(f"Error processing {file_path}: {str(e)}")
        return []

def main():
    """Main function to extract data from all Excel files"""
    # Get current directory
    root_dir = Path.cwd()
    excel_files = list(root_dir.glob('*.xlsx'))
    
    if not excel_files:
        logger.error('No Excel files found in project root.')
        return
    
    logger.info(f"Found {len(excel_files)} Excel files to process")
    
    all_results = []
    processed_files = 0
    
    for excel_file in excel_files:
        try:
            results = extract_from_excel(str(excel_file))
            all_results.extend(results)
            processed_files += 1
        except Exception as e:
            logger.error(f"Failed to process {excel_file.name}: {str(e)}")
    
    # Create output directory
    out_dir = root_dir / 'public' / 'data'
    out_dir.mkdir(parents=True, exist_ok=True)
    
    # Create the final data structure
    final_data = {
        "metadata": {
            "last_updated": datetime.now().isoformat(),
            "total_files_processed": processed_files,
            "total_entries": len(all_results)
        },
        "cutoffs": all_results
    }
    
    # Save the extracted data
    out_file = out_dir / 'cutoffs.json'
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"\nExtraction complete!")
    logger.info(f"Total files processed: {processed_files}")
    logger.info(f"Total records extracted: {len(all_results)}")
    logger.info(f"Data saved to: {out_file}")
    
    # Generate summary statistics
    year_stats = {}
    college_stats = {}
    branch_stats = {}
    category_stats = {}
    round_stats = {}
    
    for record in all_results:
        year_stats[record['year']] = year_stats.get(record['year'], 0) + 1
        college_stats[record['institute_code']] = college_stats.get(record['institute_code'], 0) + 1
        branch_stats[record['course']] = branch_stats.get(record['course'], 0) + 1
        category_stats[record['category']] = category_stats.get(record['category'], 0) + 1
        round_stats[record['round']] = round_stats.get(record['round'], 0) + 1
    
    logger.info('\nSummary Statistics:')
    logger.info(f'By Year: {year_stats}')
    logger.info(f'By Category: {category_stats}')
    logger.info(f'By Round: {round_stats}')
    logger.info(f'Top Colleges: {sorted(college_stats.items(), key=lambda x: x[1], reverse=True)[:10]}')
    logger.info(f'Top Branches: {sorted(branch_stats.items(), key=lambda x: x[1], reverse=True)[:10]}')

if __name__ == "__main__":
    main()
