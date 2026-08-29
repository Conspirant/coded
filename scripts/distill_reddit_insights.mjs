import * as fs from 'fs';
import * as path from 'path';

const RAW_PATH = path.resolve('scripts/raw_reddit_kcet.json');
const OUTPUT_PATH = path.resolve('public/data/reddit_kcet_insights.json');

const COLLEGE_MAP = [
    { code: 'E001', name: 'University Visvesvaraya College of Engineering (UVCE)', aliases: ['uvce', 'visvesvaraya college of engineering', 'uvce bangalore'] },
    { code: 'E003', name: 'BMS College of Engineering (BMSCE)', aliases: ['bmsce', 'bms college', 'bms', 'bmsce bangalore'] },
    { code: 'E005', name: 'RV College of Engineering (RVCE)', aliases: ['rvce', 'rv college', 'rv engineering', 'rvce bangalore', 'rv'] },
    { code: 'E006', name: 'MS Ramaiah Institute of Technology (MSRIT)', aliases: ['msrit', 'ramaiah', 'ms ramaiah', 'rit', 'msrit bangalore'] },
    { code: 'E007', name: 'Dayananda Sagar College of Engineering (DSCE)', aliases: ['dsce', 'dayananda sagar', 'dayanand sagar', 'dsce bangalore'] },
    { code: 'E008', name: 'Bangalore Institute of Technology (BIT)', aliases: ['bit', 'bangalore institute of technology', 'bit bangalore'] },
    { code: 'E009', name: 'PES University (PESU)', aliases: ['pes', 'pesu', 'pes university', 'pesit', 'pes rr', 'pes ec', 'pes ring road', 'pes electronic city'] },
    { code: 'E011', name: 'MVJ College of Engineering', aliases: ['mvj', 'mvjce'] },
    { code: 'E012', name: 'Sir M. Visvesvaraya Institute of Technology (Sir MVIT)', aliases: ['mvit', 'sir mvit', 'sir m visvesvaraya'] },
    { code: 'E016', name: 'Siddaganga Institute of Technology (SIT Tumkur)', aliases: ['sit', 'sit tumkur', 'siddaganga'] },
    { code: 'E021', name: 'SJCE / JSS Science & Tech University (Mysuru)', aliases: ['sjce', 'jss stu', 'jss mysore', 'sjce mysore', 'jss science and technology'] },
    { code: 'E022', name: 'The National Institute of Engineering (NIE Mysuru)', aliases: ['nie', 'nie mysore', 'nie mysuru', 'nie south', 'nie north'] },
    { code: 'E037', name: 'BNM Institute of Technology (BNMIT)', aliases: ['bnmit', 'bnm'] },
    { code: 'E056', name: 'CMR Institute of Technology (CMRIT)', aliases: ['cmrit', 'cmr it', 'cmr'] },
    { code: 'E060', name: 'Dr. Ambedkar Institute of Technology (Dr. AIT)', aliases: ['dr ait', 'ambedkar institute of technology', 'drait'] },
    { code: 'E064', name: 'RNS Institute of Technology (RNSIT)', aliases: ['rnsit', 'rns it', 'rns'] },
    { code: 'E075', name: 'New Horizon College of Engineering (NHCE)', aliases: ['nhce', 'new horizon'] },
    { code: 'E081', name: 'Nitte Meenakshi Institute of Technology (NMIT)', aliases: ['nmit', 'nitte meenakshi', 'nitte'] },
    { code: 'E099', name: 'BMS Institute of Technology (BMSIT Yelahanka)', aliases: ['bmsit', 'bms it', 'bms yelahanka'] },
    { code: 'E115', name: 'RV Institute of Technology & Management (RVITM)', aliases: ['rvitm', 'rv itm'] },
    { code: 'E173', name: 'Sai Vidya Institute of Technology (SVIT)', aliases: ['sai vidya', 'svit', 'sai vidya institute'] }
];

function detectCollege(text) {
    const l = text.toLowerCase();
    for (const c of COLLEGE_MAP) {
        for (const alias of c.aliases) {
            const regex = new RegExp(`\\b${alias}\\b`, 'i');
            if (regex.test(l)) {
                return { code: c.code, name: c.name };
            }
        }
    }
    return null;
}

function detectCategory(text) {
    const l = text.toLowerCase();
    if (l.includes('hostel') || l.includes('mess') || l.includes('pg') || l.includes('rent') || l.includes('food') || l.includes('room') || l.includes('stay') || l.includes('flat')) {
        return 'hostel';
    }
    if (l.includes('placement') || l.includes('package') || l.includes('salary') || l.includes('recruit') || l.includes('highest') || l.includes('median') || l.includes('lpa') || l.includes('tier')) {
        return 'placements';
    }
    if (l.includes('verification') || l.includes('document') || l.includes('study certificate') || l.includes('beo') || l.includes('rd number') || l.includes('snq') || l.includes('caste') || l.includes('income') || l.includes('clause')) {
        return 'verification';
    }
    if (l.includes('option entry') || l.includes('choice filling') || l.includes('mock round') || l.includes('priority list') || l.includes('preference') || l.includes('choice 1') || l.includes('choice 2') || l.includes('choice 3')) {
        return 'option_entry';
    }
    if (l.includes('surrender') || l.includes('seat surrender') || l.includes('neet drop') || l.includes('round 2') || l.includes('round 3') || l.includes('extended round') || l.includes('vacancy')) {
        return 'surrender_and_rounds';
    }
    if (l.includes('strict') || l.includes('attendance') || l.includes('vtu') || l.includes('autonomous') || l.includes('exam') || l.includes('fest') || l.includes('grading') || l.includes('cgpa')) {
        return 'strictness_and_culture';
    }
    if (l.includes(' vs ') || l.includes('better') || l.includes('compare') || l.includes('ise vs') || l.includes('aiml vs') || l.includes('ece vs') || l.includes('branch vs') || l.includes('or ') || l.includes('which one')) {
        return 'branch_comparison';
    }
    return 'general_counseling';
}

function cleanText(txt) {
    return (txt || '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x200B;/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function extractKeyTakeaways(post) {
    const takeaways = [];
    const fullText = (post.title + '\n' + (post.selftext || '')).trim();

    // From top comments
    if (post.top_comments && post.top_comments.length > 0) {
        for (const comment of post.top_comments.slice(0, 3)) {
            const lines = comment.body.split('\n').map(l => l.trim()).filter(l => l.length > 25 && !l.includes('Discord') && !l.includes('AutoModerator'));
            if (lines.length > 0) {
                const quote = lines[0].replace(/^[-*•>]\s*/, '');
                if (quote.length < 200) {
                    takeaways.push(`Senior Tip (${comment.author}): "${quote}"`);
                }
            }
        }
    }

    if (takeaways.length === 0) {
        if (fullText.length > 40) {
            takeaways.push(post.title);
        }
    }

    return takeaways.slice(0, 4);
}

function distill() {
    if (!fs.existsSync(RAW_PATH)) {
        console.error(`Raw file not found at ${RAW_PATH}`);
        process.exit(1);
    }

    const rawPosts = JSON.parse(fs.readFileSync(RAW_PATH, 'utf-8'));
    console.log(`Processing ${rawPosts.length} fresh raw Reddit posts...`);

    const distilledInsights = [];
    const categoriesCount = {};

    for (const post of rawPosts) {
        const fullText = `${post.title} ${post.selftext || ''}`;
        const college = detectCollege(fullText);
        const category = detectCategory(fullText);

        categoriesCount[category] = (categoriesCount[category] || 0) + 1;

        const summary = cleanText(post.selftext ? post.selftext.slice(0, 350) : post.title);
        const takeaways = extractKeyTakeaways(post);

        const pros = [];
        const cons = [];
        const lowerFull = fullText.toLowerCase();

        if (lowerFull.includes('placement') || lowerFull.includes('package') || lowerFull.includes('good coding')) {
            pros.push('Active tech recruitment and strong peer coding culture mentioned');
        }
        if (lowerFull.includes('metro') || lowerFull.includes('accessible') || lowerFull.includes('central')) {
            pros.push('Convenient Bangalore connectivity / metro access');
        }
        if (lowerFull.includes('strict') || lowerFull.includes('85%') || lowerFull.includes('attendance')) {
            cons.push('Strict 85% attendance rule strictly enforced by faculty');
        }
        if (lowerFull.includes('crowd') || lowerFull.includes('intake') || lowerFull.includes('seats increased')) {
            cons.push('High student intake across CS sub-branches');
        }

        distilledInsights.push({
            id: post.id,
            source: `r/${post.subreddit || 'kcet'}`,
            title: cleanText(post.title),
            collegeCode: college ? college.code : null,
            collegeName: college ? college.name : null,
            category: category,
            author: post.author,
            date: new Date(post.created_utc * 1000).toISOString().split('T')[0],
            upvotes: post.score || 1,
            numComments: post.num_comments || 0,
            summary: summary || post.title,
            keyTakeaways: takeaways,
            pros: pros.slice(0, 2),
            cons: cons.slice(0, 2),
            url: post.url
        });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(distilledInsights, null, 2), 'utf-8');
    console.log(`\n✨ Successfully distilled ${distilledInsights.length} fresh senior insights into ${OUTPUT_PATH}!`);
    console.log(`📊 Category Breakdown:`, categoriesCount);
}

distill();
