import requests, base64, json, sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

with open('.env') as f:
    for line in f:
        if line.startswith('NVIDIA_API_KEY='):
            NVIDIA_KEY = line.strip().split('=', 1)[1]

with open('scratch/phys23/p77_key_exact.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode()

prompt = "Extract the complete ANSWER KEY table from this image for questions 1 to 72. Map each question number 1 through 72 to its option letter (a, b, c, or d). Return strictly a JSON object: {\"1\": \"a\", \"2\": \"b\", ...}."

resp = requests.post(
    'https://integrate.api.nvidia.com/v1/chat/completions',
    headers={'Authorization': f'Bearer {NVIDIA_KEY}', 'Content-Type': 'application/json'},
    json={
        'model': 'meta/llama-3.2-11b-vision-instruct',
        'messages': [{'role': 'user', 'content': [
            {'type': 'text', 'text': prompt},
            {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
        ]}],
        'max_tokens': 2000
    },
    timeout=60
)
raw = resp.json()['choices'][0]['message']['content'].strip()
if '```json' in raw:
    raw = raw.split('```json')[1].split('```')[0].strip()
elif '```' in raw:
    raw = raw.split('```')[1].split('```')[0].strip()

print("Raw response:")
print(raw)
data = json.loads(raw)
print(f"Total keys parsed: {len(data)}")
with open('scratch/phys23/answer_key_strict.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
print("Saved to scratch/phys23/answer_key_strict.json")
