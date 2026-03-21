import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Add your Supabase URL and Service Role Key from .env.local here
// We use process.env to grab them, make sure to run node with --env-file=.env.local if Node >= 20
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY; 

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase URL or Key in environment");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log("Reading parsed questions...");
    const inputPath = join(rootDir, 'scripts', 'pyq_ocr_output', 'parsed_questions.json');
    let data;
    try {
        data = JSON.parse(readFileSync(inputPath, 'utf8'));
    } catch(err) {
        console.error("Could not read parsed_questions.json. Did you run parse-ocr.mjs?");
        process.exit(1);
    }

    console.log(`Found ${data.length} questions to seed. Uploading to Supabase...`);

    // We can insert them in batches of 100
    const BATCH_SIZE = 100;
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('pyq_questions').insert(batch);
        
        if (error) {
            console.error(`Error inserting batch ${i}:`, error.message);
        } else {
            console.log(`Inserted batch ${i} to ${i + batch.length}`);
        }
    }

    console.log("Seeding complete! Admin can now assign images in the AdminPYQ UI.");
}

main();
