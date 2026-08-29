import * as fs from 'fs';
import * as path from 'path';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const RAW_OUTPUT = path.resolve('scripts/raw_reddit_kcet.json');

// Freshness cutoff: January 1, 2024 (Discard all outdated legacy posts)
const MIN_TIMESTAMP_2024 = 1704067200;

async function fetchJson(url) {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'CodedCET-Oracle-Harvester/3.0'
            }
        });
        if (!res.ok) {
            console.warn(`[HTTP ${res.status}] for ${url}`);
            return [];
        }
        const json = await res.json();
        return Array.isArray(json.data) ? json.data : [];
    } catch (e) {
        console.warn(`Fetch error: ${e.message}`);
        return [];
    }
}

async function harvestMultiSubreddit() {
    console.log('🚀 Starting Multi-Subreddit Fresh Harvest (2024–2026 Only)...');
    const postsMap = new Map();

    // 1. Primary Hub: r/kcet (Paginate recent 15 pages x 100 = 1,500 posts)
    let before = Math.floor(Date.now() / 1000);
    const kcetPages = 15;

    for (let p = 1; p <= kcetPages; p++) {
        const url = `https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=kcet&limit=100&before=${before}`;
        console.log(`📡 [r/kcet Page ${p}/${kcetPages}] Fetching 100 posts before ${new Date(before * 1000).toISOString().split('T')[0]}...`);
        const posts = await fetchJson(url);

        if (!posts || posts.length === 0) break;

        let added = 0;
        let reachedOlderThan2024 = false;

        for (const post of posts) {
            if (post.created_utc && post.created_utc < MIN_TIMESTAMP_2024) {
                reachedOlderThan2024 = true;
                continue;
            }
            if (post.id && !postsMap.has(post.id)) {
                postsMap.set(post.id, post);
                added++;
            }
            if (post.created_utc && post.created_utc < before) {
                before = post.created_utc;
            }
        }

        console.log(`   -> Added +${added} fresh posts. Total: ${postsMap.size}`);
        if (reachedOlderThan2024) {
            console.log('   Reached pre-2024 boundary for r/kcet. Stopping pagination.');
            break;
        }
        await sleep(500);
    }

    // 2. Targeted Multi-Subreddit Search Hubs (r/comedk, r/bangalore, r/Btechtards, r/JEENEETards, r/PESU, r/rvce, r/BMSCE)
    const TARGET_SEARCHES = [
        // r/comedk queries
        { sub: 'comedk', q: 'rvce' },
        { sub: 'comedk', q: 'bmsce' },
        { sub: 'comedk', q: 'msrit' },
        { sub: 'comedk', q: 'dsce' },
        { sub: 'comedk', q: 'bmsit' },
        { sub: 'comedk', q: 'bit' },
        { sub: 'comedk', q: 'hostel' },
        { sub: 'comedk', q: 'kcet vs comedk' },
        { sub: 'comedk', q: 'placements' },
        // r/Btechtards queries (Branch & Karnataka College Truth)
        { sub: 'Btechtards', q: 'rvce' },
        { sub: 'Btechtards', q: 'bmsce' },
        { sub: 'Btechtards', q: 'msrit' },
        { sub: 'Btechtards', q: 'pes university' },
        { sub: 'Btechtards', q: 'vtu autonomous' },
        { sub: 'Btechtards', q: 'cse vs ise' },
        { sub: 'Btechtards', q: 'ece tech placements' },
        { sub: 'Btechtards', q: 'kcet counseling' },
        // r/bangalore queries (Local Reality, Transit, PGs)
        { sub: 'bangalore', q: 'engineering college' },
        { sub: 'bangalore', q: 'rvce bmsce' },
        { sub: 'bangalore', q: 'hostel pg bangalore college' },
        // r/PESU (PES University specific inside intelligence)
        { sub: 'PESU', q: 'placements' },
        { sub: 'PESU', q: 'hostel' },
        { sub: 'PESU', q: 'rr vs ec campus' },
        { sub: 'PESU', q: 'kcet' },
        // r/JEENEETards queries
        { sub: 'JEENEETards', q: 'kcet' },
        { sub: 'JEENEETards', q: 'neet surrender kcet' },
        { sub: 'JEENEETards', q: 'rvce vs bmsce' }
    ];

    for (let i = 0; i < TARGET_SEARCHES.length; i++) {
        const item = TARGET_SEARCHES[i];
        console.log(`🔍 [${i + 1}/${TARGET_SEARCHES.length}] Searching r/${item.sub} for "${item.q}"...`);
        const searchUrl = `https://arctic-shift.photon-reddit.com/api/posts/search?subreddit=${item.sub}&query=${encodeURIComponent(item.q)}&limit=40`;
        const posts = await fetchJson(searchUrl);
        let added = 0;

        for (const post of posts) {
            if (post.created_utc && post.created_utc < MIN_TIMESTAMP_2024) continue;
            if (post.id && !postsMap.has(post.id)) {
                postsMap.set(post.id, post);
                added++;
            }
        }
        console.log(`   -> Added +${added} posts. Total: ${postsMap.size}`);
        await sleep(500);
    }

    console.log(`\n📦 Total unique 2024–2026 posts harvested: ${postsMap.size}`);

    // 3. Harvest rich senior discussion comments (2024-2026)
    console.log('💬 Harvesting fresh senior comments across subreddits...');
    const commentsList = [];
    let commentBefore = Math.floor(Date.now() / 1000);
    const commentBatches = 12;

    for (let b = 1; b <= commentBatches; b++) {
        const commentUrl = `https://arctic-shift.photon-reddit.com/api/comments/search?subreddit=kcet&limit=100&before=${commentBefore}`;
        console.log(`   [Batch ${b}/${commentBatches}] Fetching 100 comments before ${new Date(commentBefore * 1000).toISOString().split('T')[0]}...`);
        const comments = await fetchJson(commentUrl);

        if (!comments || comments.length === 0) break;

        for (const c of comments) {
            if (c.created_utc && c.created_utc < MIN_TIMESTAMP_2024) continue;
            if (c.body && c.body.length > 25 && !c.body.includes('[deleted]') && !c.body.includes('[removed]')) {
                commentsList.push({
                    id: c.id,
                    link_id: c.link_id?.replace('t3_', '') || '',
                    author: c.author || 'Senior Redditor',
                    body: c.body.trim(),
                    score: c.score || 1,
                    created_utc: c.created_utc
                });
            }
            if (c.created_utc && c.created_utc < commentBefore) {
                commentBefore = c.created_utc;
            }
        }
        await sleep(500);
    }

    console.log(`✅ Harvested ${commentsList.length} fresh senior comments.`);

    // Group comments by post link_id
    const commentsByPost = new Map();
    for (const c of commentsList) {
        if (c.link_id) {
            if (!commentsByPost.has(c.link_id)) commentsByPost.set(c.link_id, []);
            commentsByPost.get(c.link_id).push(c);
        }
    }

    // Assemble final structured raw list (filtered for substantial content)
    const finalPosts = Array.from(postsMap.values())
        .filter(p => {
            const text = (p.title || '') + ' ' + (p.selftext || '');
            return text.trim().length >= 15 && !p.over_18;
        })
        .map(p => {
            const postComments = commentsByPost.get(p.id) || [];
            return {
                id: p.id,
                title: p.title || '',
                selftext: p.selftext || '',
                author: p.author || 'Senior Redditor',
                score: p.score || 1,
                num_comments: p.num_comments || postComments.length,
                created_utc: p.created_utc || Math.floor(Date.now() / 1000),
                url: p.permalink ? `https://reddit.com${p.permalink}` : `https://reddit.com/r/${p.subreddit || 'kcet'}/comments/${p.id}`,
                subreddit: p.subreddit || 'kcet',
                top_comments: postComments.sort((a, b) => b.score - a.score).slice(0, 5)
            };
        });

    fs.writeFileSync(RAW_OUTPUT, JSON.stringify(finalPosts, null, 2), 'utf-8');
    console.log(`\n🎉 Successfully saved ${finalPosts.length} fresh 2024–2026 posts to ${RAW_OUTPUT}!`);
}

harvestMultiSubreddit().catch(err => {
    console.error('Multi-subreddit harvest failed:', err);
    process.exit(1);
});
