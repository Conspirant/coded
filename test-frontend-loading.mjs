import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simulate the frontend loading process
async function simulateFrontendLoading() {
  try {
    console.log('🧪 Simulating frontend review loading process...\n');
    
    // Step 1: Load colleges (like the frontend does)
    console.log('📋 Step 1: Loading colleges...');
    const response = await fetch('https://kcet-coded.vercel.app/colleges-list.json');
    if (!response.ok) {
      throw new Error('Failed to load colleges data');
    }
    const colleges = await response.json();
    console.log(`Loaded ${colleges.length} colleges`);
    
    // Step 2: Load reviews from Supabase (like the frontend does)
    console.log('\n📖 Step 2: Loading reviews from Supabase...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('college_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.log('❌ Error loading reviews:', reviewsError.message);
      return;
    }

    console.log(`Loaded ${reviews?.length || 0} reviews from Supabase`);
    
    if (reviews && reviews.length > 0) {
      // Step 3: Get college information for each review (like the frontend does)
      console.log('\n🏫 Step 3: Getting college information...');
      const collegeIds = [...new Set(reviews.map(review => review.college_id))];
      const { data: collegesData, error: collegesError } = await supabase
        .from('colleges')
        .select('id, code, name')
        .in('id', collegeIds);

      if (collegesError) {
        console.log('❌ Error loading colleges:', collegesError.message);
        return;
      }

      // Create a lookup map for colleges
      const collegeMap = new Map();
      if (collegesData) {
        collegesData.forEach(college => {
          collegeMap.set(college.id, college);
        });
      }

      // Step 4: Map reviews to colleges (like the frontend does)
      console.log('\n🔗 Step 4: Mapping reviews to colleges...');
      const mappedReviews = reviews.map(review => {
        const college = collegeMap.get(review.college_id);
        return {
          id: review.id,
          college_id: review.college_id,
          user_id: review.user_id,
          session_id: review.session_id,
          rating: review.rating || 0,
          review_text: review.review_text || '',
          faculty_rating: review.faculty_rating || 0,
          infrastructure_rating: review.infrastructure_rating || 0,
          placements_rating: review.placements_rating || 0,
          helpful_votes: review.helpful_votes || 0,
          verified: review.verified || false,
          created_at: review.created_at || new Date().toISOString(),
          collegeCode: college?.code,
          collegeName: college?.name,
          author: 'Anonymous User'
        };
      });

      console.log(`Mapped ${mappedReviews.length} reviews with college information`);
      
      // Step 5: Filter reviews by college code (like the frontend does)
      console.log('\n🎯 Step 5: Filtering reviews by college code...');
      const result = colleges.map(college => ({
        college,
        reviews: mappedReviews.filter(review => review.collegeCode === college.code)
      }));

      // Find colleges with reviews
      const collegesWithReviews = result.filter(item => item.reviews.length > 0);
      console.log(`Found ${collegesWithReviews.length} colleges with reviews`);
      
      collegesWithReviews.forEach(item => {
        console.log(`\n📚 ${item.college.code} - ${item.college.name}:`);
        console.log(`   ${item.reviews.length} review(s)`);
        item.reviews.forEach((review, index) => {
          console.log(`   ${index + 1}. Rating: ${review.rating}/5`);
          console.log(`      Text: ${review.review_text.substring(0, 80)}...`);
          console.log(`      Author: ${review.author}`);
        });
      });
      
      if (collegesWithReviews.length > 0) {
        console.log('\n🎉 SUCCESS! Reviews are now properly loaded and visible!');
        console.log('   The review system should work correctly on the website now.');
      } else {
        console.log('\n❌ No colleges with reviews found - there might still be an issue.');
      }
    } else {
      console.log('No reviews found in database');
    }
    
  } catch (error) {
    console.error('❌ Error during simulation:', error);
  }
}

simulateFrontendLoading();
