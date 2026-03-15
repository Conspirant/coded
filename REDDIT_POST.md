# I got so fed up with KEA's website and PDFs that I built my own KCET platform (Free & Open Source)

Hey guys,

Like most of you, I've spent the last few weeks stressing over KCET. Trying to predict ranks, digging through blurry 2023 cutoff PDFs, and trying to figure out which colleges I actually have a shot at. The whole process is an absolute nightmare, and frankly, the official KEA website doesn't make it any easier.

I finally got so annoyed that I just decided to build my own platform to automate everything. 

It’s called **[KCET Compass](https://kcet-coded2.vercel.app)**. I built it to be the tool I wish I had on day one. It’s completely free, has zero ads, and the whole codebase is open-source.

I wanted to share it here because I think it could seriously help a lot of people during option entry. Here is exactly what it does:

### The Tools You'll Actually Need

*   **A Cutoff Explorer that actually works:** Instead of Ctrl+F-ing through PDFs, I put all 250,000+ cutoff records from the last 3 years into a massive database. You can instantly filter by your exact category (like 3BG or SNQ), the college, the branch, and the round. You can literally see how the cutoffs trended year over year.
*   **A "Realistic" Rank Predictor:** I built a predictor that isn't just a random guess. You put in your expected KCET PCM marks and your Board PCM percentage. It maps that against historical standard deviation shifts to give you a pretty accurate rank range. (You can also generate a card to share/flex your predicted rank if you want lol).
*   **The College Finder (My favorite feature):** Honestly, this is the most useful part. Once you get your rank, you just enter it, and the app splits every engineering college in Karnataka into three lists for you:
    *   **Safe Bets:** You are basically guaranteed a seat here.
    *   **Moderate:** You are right on the edge of the cutoff.
    *   **Ambitious:** Dream colleges that are a slight reach, but you should put them at the top of your option entry list just in case you get lucky in Round 2.
*   **A Dummy Option Entry Simulator:** The anxiety of making a mistake on the real KEA portal is horrible. So, I recreated the portal. You can search for colleges, add them to a mock list, and drag-and-drop them to practice your priority order before the real thing starts.
*   **Option Entry PDF Grader:** If you've already finalized your option entry and downloaded the KEA PDF, you can upload that PDF to my site. The app will "read" your choices and warn you if you did something stupid—like putting a college with a 40k cutoff *above* a college with a 5k cutoff, or forgetting an obviously better college in your list.

### Helping You Make the Right Choice

It’s not just about the numbers; picking a college is hard.

*   **Head-to-Head Compare:** You can select 2 or 3 colleges and instantly compare their tuition/hostel fees, average placement packages, and historical cutoffs side-by-side.
*   **Real Student Reviews:** I added a section for authentic reviews. No brochure BS. Just seniors talking about how strict the college is, what the hostel food actually tastes like, and if the placements are real or inflated. (If you’re already in college, please log in and drop a review for the juniors!).
*   **AI Counselor:** I trained an AI specifically on KEA's thick rulebook and all the reservation policies. If you have a weird specific question at 2 AM (like "Do I still need a rural certificate if I only studied there till 7th grade?"), you can just ask the AI instead of waiting for a reply on Reddit.
*   **Checklists & Trackers:** There’s a dynamic document checklist (tick off Annexures as you get them signed), a centralized news feed for KEA updates, and a Round Tracker so you don't miss any deadlines.

### Some Fun/Cool Stuff I Added

Counseling is stressful, so I added some things just to keep it interesting.

*   **Commute Mappers:** Bangalore traffic is a joke. I built a **Metro Mapper** and a **BMTC Mapper**. It overlays all the engineering colleges on top of the Namma Metro map and major bus routes. You can instantly see which colleges are actually commutable without hating your life every morning.
*   **Hidden Gems Finder:** This is an algorithm I wrote that scans the database and spits out colleges that have weirdly low cutoffs but really high placement rates. Basically, the underrated colleges everyone forgets about.
*   **Squad Finder:** Enter your rank and target colleges, and it matches you with other users aiming for the exact same spots. You can find your future batchmates before college even starts.
*   **Cutoff Clash:** A mini-game I coded where you guess which college branch had a higher cutoff last year. It’s surprisingly addictive and kind of subliminally teaches you which colleges are ranked higher.

If you are a power user on desktop, press `Ctrl + K` anywhere on the site for a quick-search bar, or press `?` to see keyboard shortcuts. (Try typing the Konami Code too: `↑ ↑ ↓ ↓ ← → ← → B A`).

### TL;DR

I was frustrated with KEA, so I built an entire admissions platform from scratch. The site is **[kcet-coded.vercel.app](https://kcet-coded.vercel.app)**. 

Since it's 100% open-source, if you know how to code, hit up the GitHub link and help me improve it! Let's beat the confusing KEA system together.

If this helps you, please share it with your friends or your class WhatsApp groups. If you find any bugs or have feature ideas, let me know in the comments. Good luck with the results guys!
