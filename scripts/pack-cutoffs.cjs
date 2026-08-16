const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const inputFiles = [
    path.join(__dirname, '..', 'public', 'data', 'kcet_cutoffs_high_volume.dat'),
    path.join(__dirname, '..', 'public', 'kcet_cutoffs_high_volume.dat'),
    path.join(__dirname, '..', 'public', 'data', 'kcet_cutoffs_consolidated.dat'),
    path.join(__dirname, '..', 'public', 'kcet_cutoffs.dat')
];

let rawData = null;
for (const file of inputFiles) {
    if (fs.existsSync(file)) {
        console.log('Reading cutoff source from:', file);
        rawData = fs.readFileSync(file, 'utf8');
        break;
    }
}

if (!rawData) {
    console.error('No raw cutoff data file found!');
    process.exit(1);
}

const parsed = JSON.parse(rawData);
const cutoffs = Array.isArray(parsed) ? parsed : (parsed.cutoffs || parsed.data || parsed.cutoffs_data || []);

console.log(`Parsed ${cutoffs.length} raw cutoff records.`);

// Build dictionaries
const instituteMap = new Map();
const institutes = [];
const courseMap = new Map();
const courses = [];
const categoryMap = new Map();
const categories = [];
const yearMap = new Map();
const years = [];
const roundMap = new Map();
const rounds = [];

function getId(map, list, val) {
    const s = (val || '').trim();
    if (!map.has(s)) {
        const id = list.length;
        map.set(s, id);
        list.push(s);
        return id;
    }
    return map.get(s);
}

// Special dictionary for institutes: code and name
const instObjMap = new Map();
const instList = []; // [code, name]

function getInstId(code, name) {
    const c = (code || '').trim();
    const n = (name || '').trim();
    const key = `${c}|${n}`;
    if (!instObjMap.has(key)) {
        const id = instList.length;
        instObjMap.set(key, id);
        instList.push([c, n]);
        return id;
    }
    return instObjMap.get(key);
}

const records = [];

for (const c of cutoffs) {
    const instId = getInstId(c.institute_code || c.college_code, c.institute || c.college_name);
    const courseId = getId(courseMap, courses, c.course || c.branch_name);
    const catId = getId(categoryMap, categories, c.category);
    const yearId = getId(yearMap, years, String(c.year || '2025'));
    const roundId = getId(roundMap, rounds, String(c.round || 'R1'));
    const rank = Number(c.cutoff_rank) || 0;

    records.push([instId, courseId, catId, yearId, roundId, rank]);
}

const packedStructure = {
    v: 1,
    totals: {
        records: records.length,
        colleges: instList.length,
        branches: courses.length
    },
    dict: {
        i: instList,
        c: courses,
        cat: categories,
        y: years,
        r: rounds
    },
    rows: records
};

const jsonString = JSON.stringify(packedStructure);
console.log(`Packed JSON string size: ${(jsonString.length / 1024 / 1024).toFixed(2)} MB`);

// Compress with maximum deflate compression
const compressed = zlib.deflateSync(Buffer.from(jsonString, 'utf8'), { level: 9 });
console.log(`Deflated binary size: ${(compressed.length / 1024 / 1024).toFixed(2)} MB (${(compressed.length / 1024).toFixed(0)} KB)`);

// Apply XOR Byte Mask (0xA7) with 'KCTV' magic bytes
const magic = Buffer.from([0x4B, 0x43, 0x54, 0x56, 0x01, 0xA7]); // KCTV + version 1 + key 0xA7
const maskedBody = Buffer.alloc(compressed.length);

for (let i = 0; i < compressed.length; i++) {
    maskedBody[i] = compressed[i] ^ 0xA7;
}

const finalVaultBuffer = Buffer.concat([magic, maskedBody]);

console.log(`Final Obfuscated Vault Buffer size: ${(finalVaultBuffer.length / 1024).toFixed(1)} KB`);

// Output locations
const outputPaths = [
    path.join(__dirname, '..', 'public', 'data', 'vault_core.bin'),
    path.join(__dirname, '..', 'public', 'vault_core.bin')
];

for (const outPath of outputPaths) {
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, finalVaultBuffer);
    console.log(`Successfully written vault to: ${outPath}`);
}
