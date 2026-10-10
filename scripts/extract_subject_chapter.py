import os
import base64
import requests
import json
import re

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            key = line.strip().split('=', 1)[1]

def extract_from_image(image_path, subject, chapter_name, chapter_number):
    print(f"Extracting {subject} Ch {chapter_number} ({chapter_name}) from {image_path}...")
    with open(image_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()

    prompt = f"""You are an expert exam digitizer for Karnataka CET (KCET).
Analyze this image from the KCET Chapterwise PYQ book.
Subject: {subject}
Chapter {chapter_number}: {chapter_name}

Extract all questions present on this page slice.
Also check the ANSWER KEY and/or SOLUTIONS shown on the page (or bottom) to accurately set the correct answer index (0 for (a), 1 for (b), 2 for (c), 3 for (d)) and detailed explanation.

Format every mathematical formula, exponent, chemical formula, or unit cleanly with LaTeX delimiters ($...$ for inline, e.g. $H_2SO_4$, $x \\in A$, $\\frac{{a}}{{b}}$, $[M L^2 T^{{-2}}]$). Make sure EVERY dollar sign is properly paired ($...$).
Do not use raw newline escape sequences inside string fields without proper JSON escaping.

Return ONLY a valid JSON array of objects with this schema:
[
  {{
    "subject": "{subject}",
    "chapter": "{chapter_name}",
    "chapter_number": {chapter_number},
    "question": "question text with LaTeX $...$",
    "options": [
      "option A with LaTeX $...$",
      "option B with LaTeX $...$",
      "option C with LaTeX $...$",
      "option D with LaTeX $...$"
    ],
    "correct_answer": 0,
    "year": 2015,
    "explanation": "Step-by-step solution with LaTeX $...$",
    "needs_image": false,
    "image_url": ""
  }}
]
"""

    resp = requests.post(
        'https://integrate.api.nvidia.com/v1/chat/completions',
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'},
        json={
            'model': 'meta/llama-3.2-11b-vision-instruct',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
                ]
            }],
            'max_tokens': 4000,
            'temperature': 0.1
        }
    )

    content = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in content:
        content = content.split('```json')[1].split('```')[0].strip()
    elif '```' in content:
        content = content.split('```')[1].split('```')[0].strip()
    
    try:
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        # Save raw output
        with open('scratch/raw_extract_error.txt', 'w', encoding='utf-8') as ef:
            ef.write(content)
        return []

if __name__ == '__main__':
    # Extract Chemistry Chapter 1 (Some Basic Concepts of Chemistry)
    chem_qs = extract_from_image('scratch/chem_ch1/p102_right.png', 'Chemistry', 'Some Basic Concepts of Chemistry', 1)
    print(f"Extracted {len(chem_qs)} questions for Chemistry Ch 1")
    with open('scratch/chem_ch1_extracted.json', 'w', encoding='utf-8') as f:
        json.dump(chem_qs, f, indent=2)

    # Extract Math Chapter 1 (Sets)
    math_qs = extract_from_image('scratch/math_ch1/p169_right.png', 'Mathematics', 'Sets', 1)
    print(f"Extracted {len(math_qs)} questions for Math Ch 1")
    with open('scratch/math_ch1_extracted.json', 'w', encoding='utf-8') as f:
        json.dump(math_qs, f, indent=2)
