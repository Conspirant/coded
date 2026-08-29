"""
Zero-Cost Reddit Scraper & Knowledge Formatter for KCET Coded
Extracts student discussions from r/kcet, r/bangalore, r/Btechtards, r/PESU
"""

import json
import os
import time
import urllib.request
import urllib.parse
from datetime import datetime

SUBREDDITS = ["kcet", "bangalore", "Btechtards", "PESU"]

QUERIES = [
    "college review",
    "hostel mess",
    "placements",
    "BMSCE vs MSRIT",
    "RVCE vs BMSCE",
    "PES vs BMSCE",
    "RVCE ECE vs PES CSE",
    "document verification tips",
    "option entry strategy",
    "mock round vs round 1",
    "NEET surrender seats",
    "UVCE review",
    "DSCE review",
    "BMSIT review",
    "NIE Mysuru vs SJCE"
]

COLLEGE_MAP = [
    {"code": "E001", "name": "RV College of Engineering", "aliases": ["rvce", "rv college", "rvce bangalore"]},
    {"code": "E003", "name": "BMS College of Engineering", "aliases": ["bmsce", "bms college", "bms basavanagudi"]},
    {"code": "E005", "name": "Ramaiah Institute of Technology", "aliases": ["msrit", "ramaiah", "ms ramaiah"]},
    {"code": "E006", "name": "PES University", "aliases": ["pes rr", "pes ring road", "pes university", "pes ec", "pesu"]},
    {"code": "E008", "name": "University Visvesvaraya College of Engineering", "aliases": ["uvce", "uvce bangalore"]},
    {"code": "E007", "name": "Bangalore Institute of Technology", "aliases": ["bit bangalore", "bit kcet"]},
    {"code": "E031", "name": "Dayananda Sagar College of Engineering", "aliases": ["dsce", "dayananda sagar"]},
    {"code": "E099", "name": "BMS Institute of Technology", "aliases": ["bmsit", "bms it", "bms yelahanka"]},
    {"code": "E021", "name": "SJCE / JSS Science and Technology University", "aliases": ["sjce", "jss stu", "jss mysore"]},
    {"code": "E022", "name": "National Institute of Engineering", "aliases": ["nie mysore", "nie mysuru"]}
]

def detect_codes(text):
    lower = text.lower()
    codes = []
    for item in COLLEGE_MAP:
        if any(alias in lower for alias in item["aliases"]) or item["name"].lower() in lower:
            codes.append(item["code"])
    return list(set(codes))

def detect_categories(text):
    lower = text.lower()
    cats = []
    if any(w in lower for w in ["hostel", "mess", "room", "pg", "stay"]):
        cats.append("hostel_campus")
    if any(w in lower for w in ["placement", "package", "salary", "ctc", "tier 1", "tier 2"]):
        cats.append("placements")
    if any(w in lower for w in ["vs", "or", "compare", "better"]):
        cats.append("college_comparison")
    if any(w in lower for w in ["verification", "document", "snq", "option entry", "surrender", "mock"]):
        cats.append("counseling_strategy")
    if any(w in lower for w in ["strict", "attendance", "faculty", "fest"]):
        cats.append("campus_life")
    return cats if cats else ["general_discussion"]

def fetch_json(url):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) KCET-Coded-Guidance/1.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"Fetch warning: {e}")
        return None

def main():
    print("🚀 Running Python Reddit Extractor for KCET Coded...")
    seen_ids = set()
    collected = []

    for sub in SUBREDDITS:
        for q in QUERIES:
            print(f"🔍 Searching r/{sub} for '{q}'...")
            encoded_q = urllib.parse.quote(q)
            url = f"https://www.reddit.com/r/{sub}/search.json?q={encoded_q}&restrict_sr=1&sort=relevance&limit=15"
            data = fetch_json(url)

            if data and "data" in data and "children" in data["data"]:
                for child in data["data"]["children"]:
                    post = child.get("data", {})
                    pid = post.get("id")
                    if not pid or pid in seen_ids or post.get("over_18") or post.get("stickied"):
                        continue
                    
                    title = post.get("title", "").strip()
                    selftext = post.get("selftext", "").strip()
                    if selftext in ["[deleted]", "[removed]"] or len(title + selftext) < 40:
                        continue

                    seen_ids.add(pid)
                    combined = f"{title} {selftext}"

                    collected.append({
                        "id": pid,
                        "title": title,
                        "content": selftext[:1000],
                        "url": f"https://www.reddit.com{post.get('permalink', '')}",
                        "subreddit": post.get("subreddit", sub),
                        "score": post.get("score", 1),
                        "numComments": post.get("num_comments", 0),
                        "collegeCodes": detect_codes(combined),
                        "categories": detect_categories(combined),
                        "createdAt": datetime.fromtimestamp(post.get("created_utc", time.time())).isoformat()
                    })

            time.sleep(1.0)

    out_dir = os.path.join(os.path.dirname(__file__), "../public/data")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "reddit_kcet_insights.json")

    # If file exists, merge
    if os.path.exists(out_file):
        try:
            with open(out_file, "r", encoding="utf-8") as f:
                existing = json.load(f)
                for item in existing:
                    if item["id"] not in seen_ids:
                        collected.append(item)
                        seen_ids.add(item["id"])
        except Exception:
            pass

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(collected, f, indent=2)

    print(f"✅ Total {len(collected)} Reddit discussions indexed in {out_file}")

if __name__ == "__main__":
    main()
