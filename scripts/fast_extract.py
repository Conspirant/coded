import os
import base64
import requests
import json
import time

openrouter_key = None
nvidia_key = None

with open('.env') as f:
    for line in f:
        line = line.strip()
        if line.startswith('VITE_OPENROUTER_API_KEY='):
            openrouter_key = line.split('=', 1)[1]
        elif line.startswith('NVIDIA_API_KEY='):
            nvidia_key = line.split('=', 1)[1]

def extract_with_openrouter(image_path, subject, chapter_name, chapter_number):
    print(f"Extracting {subject} Ch {chapter_number} via OpenRouter...", flush=True)
    with open(image_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()

    prompt = f"""You are an expert exam digitizer for Karnataka CET (KCET).
Analyze this image from the KCET Chapterwise PYQ book.
Subject: {subject}
Chapter {chapter_number}: {chapter_name}

Extract all questions present on this page slice.
Also check the ANSWER KEY and/or SOLUTIONS shown on the page (or bottom) to accurately set the correct answer index (0 for (a), 1 for (b), 2 for (c), 3 for (d)) and detailed explanation.

Format every mathematical formula, exponent, chemical formula, or unit cleanly with LaTeX delimiters ($...$ for inline, e.g. $H_2SO_4$, $x \\in A$, $\\frac{{a}}{{b}}$, $[M L^2 T^{{-2}}]$). Make sure EVERY dollar sign is properly paired ($...$).
Ensure all linebreaks in solutions are formatted as standard text or \\n.

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
        'https://openrouter.ai/api/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {openrouter_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://kcetcoded.dev',
            'X-Title': 'KCET PYQ Ingestion'
        },
        json={
            'model': 'google/gemini-2.5-flash',
            'messages': [{
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': prompt},
                    {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
                ]
            }],
            'temperature': 0.1
        },
        timeout=60
    )

    if resp.status_code != 200:
        print(f"OpenRouter error: {resp.status_code} - {resp.text}", flush=True)
        return []

    content = resp.json()['choices'][0]['message']['content'].strip()
    if '```json' in content:
        content = content.split('```json')[1].split('```')[0].strip()
    elif '```' in content:
        content = content.split('```')[1].split('```')[0].strip()

    try:
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Error parsing JSON: {e}", flush=True)
        print("Raw:", content[:200], flush=True)
        return []

if __name__ == '__main__':
    # Test Chemistry Chapter 1
    t0 = time.time()
    chem_qs = extract_with_openrouter('scratch/chem_ch1/p102_right.png', 'Chemistry', 'Some Basic Concepts of Chemistry', 1)
    print(f"Extracted {len(chem_qs)} questions in {time.time() - t0:.1f}s", flush=True)
    if chem_qs:
        with open('scratch/chem_ch1_extracted.json', 'w', encoding='utf-8') as f:
            json.dump(chem_qs, f, indent=2)
        print("Saved to scratch/chem_ch1_extracted.json", flush=True)
