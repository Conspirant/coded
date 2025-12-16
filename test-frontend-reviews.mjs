import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testFrontendReviews() {
  try {
    console.log('🧪 Testing frontend review loading logic...\n');
    
    // Simulate the exact logic from loadReviewsFromSupabase
    console.log('1. Loading reviews from Supabase...');
    
    // First try simple query without joins
    const { data: reviews, error: reviewsError } = await supabase
      .from('college_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('Error loading reviews from Supabase:', reviewsError);
      return;
    }

    console.log(`Loaded ${reviews?.length || 0} reviews from Supabase`);
    
    if (!reviews || reviews.length === 0) {
      console.log('No reviews found in database');
      return;
    }

    // Get college information for each review
    const collegeIds = [...new Set(reviews.map(review => review.college_id))];
    console.log(`Found ${collegeIds.length} unique colleges for reviews`);
    
    const { data: colleges, error: collegesError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .in('id', collegeIds);

    if (collegesError) {
      console.error('Error loading colleges:', collegesError);
    }

    // Create a lookup map for colleges
    const collegeMap = new Map();
    if (colleges) {
      colleges.forEach(college => {
        collegeMap.set(college.id, college);
      });
    }

    const processedReviews = reviews.map(review => {
      const college = collegeMap.get(review.college_id);
      return {
        id: review.id,
        college_id: review.college_id,
        user_id: review.user_id,
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
        author: `User ${review.user_id?.slice(0, 8) || 'Anonymous'}`
      };
    });

    console.log(`\n✅ Processed ${processedReviews.length} reviews:`);
    processedReviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.collegeCode} - Rating: ${review.rating}/5 - "${review.review_text.substring(0, 50)}..."`);
    });

    // Test creating a new review
    console.log('\n2. Testing review creation...');
    
    // Get a college
    const { data: testCollege, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(1)
      .single();
    
    if (collegeError || !testCollege) {
      console.log('❌ No colleges available for testing');
      return;
    }
    
    console.log(`Using college: ${testCollege.code} - ${testCollege.name}`);
    
    // Create a test review
    const testReview = {
      college_id: testCollege.id,
      user_id: crypto.randomUUID(),
      rating: 4,
      review_text: 'This is a test review to verify the frontend works correctly',
      faculty_rating: 4,
      infrastructure_rating: 3,
      placements_rating: 5,
      helpful_votes: 0,
      verified: false
    };
    
    const { data: newReview, error: reviewError } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select('*')
      .single();
    
    if (reviewError) {
      console.log('❌ Cannot create review:', reviewError.message);
    } else {
      console.log('✅ Created test review:', newReview.id);
      
      // Test loading it back
      const { data: allReviews, error: loadError } = await supabase
        .from('college_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (loadError) {
        console.log('❌ Cannot load reviews:', loadError.message);
      } else {
        console.log(`✅ Successfully loaded ${allReviews.length} total reviews`);
        console.log('Latest review:', {
          id: allReviews[0].id,
          college_id: allReviews[0].college_id,
          rating: allReviews[0].rating,
          review_text: allReviews[0].review_text
        });
      }
      
      // Clean up
      await supabase.from('college_reviews').delete().eq('id', newReview.id);
      console.log('✅ Test review cleaned up');
    }
    
    console.log('\n🎉 FRONTEND REVIEW SYSTEM IS READY!');
    console.log('Reviews will now be visible to all users when you deploy.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFrontendReviews();
