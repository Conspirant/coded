export interface College {
  code: string;
  name: string;
}

export interface CollegeReview {
  id: string;
  college_id: string;
  user_id?: string; // Made optional for anonymous reviews
  session_id?: string; // Added for anonymous user tracking
  rating: number;
  review_text: string;
  faculty_rating: number;
  infrastructure_rating: number;
  placements_rating: number;
  helpful_votes: number;
  verified: boolean;
  created_at: string;
  // Additional fields for display
  collegeCode?: string;
  collegeName?: string;
  author?: string;
  // Additional fields to match working schema
  comment?: string;
  course?: string;
  graduation_year?: number;
  helpful?: number;
}

import { supabase } from "@/integrations/supabase/client";

// Get or create a user session ID for tracking user's own reviews
const getUserSessionId = (): string => {
  let sessionId = localStorage.getItem('user_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('user_session_id', sessionId);
  }
  return sessionId;
};

// Load reviews from localStorage (temporary solution)
const loadReviewsFromLocalStorage = (): CollegeReview[] => {
  try {
    const reviews = JSON.parse(localStorage.getItem('local_reviews') || '[]');
    return reviews;
  } catch (error) {
    console.error('Error loading reviews from localStorage:', error);
    return [];
  }
};

// Load reviews from Supabase (when authentication is properly set up)
const loadReviewsFromSupabase = async (): Promise<CollegeReview[]> => {
  try {
    // First try simple query without joins
    const { data: reviews, error: reviewsError } = await supabase
      .from('college_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (reviewsError) {
      console.error('❌ Error loading reviews from Supabase:', reviewsError);
      return [];
    }
    
    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Get college information for each review
    const collegeIds = [...new Set(reviews.map(review => review.college_id))];
    
    const { data: colleges, error: collegesError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .in('id', collegeIds);

    if (collegesError) {
      console.error('Error loading colleges:', collegesError);
      // Still return reviews even if college data fails to load
      return reviews.map(review => ({
        id: review.id,
        college_id: review.college_id,
        user_id: review.user_id,
        session_id: review.session_id,
        rating: review.rating || 0,
        review_text: review.review_text || '',
        faculty_rating: review.faculty_rating || 1,
        infrastructure_rating: review.infrastructure_rating || 1,
        placements_rating: review.placements_rating || 1,
        helpful_votes: review.helpful_votes || 0,
        verified: review.verified || false,
        created_at: review.created_at || new Date().toISOString(),
        collegeCode: 'Unknown',
        collegeName: 'Unknown College',
        author: 'Anonymous User',
        // Additional fields (using defaults since they don't exist in current schema)
        comment: review.review_text,
        course: '',
        graduation_year: new Date().getFullYear(),
        helpful: review.helpful_votes || 0
      }));
    }

    // Create a lookup map for colleges
    const collegeMap = new Map();
    if (colleges) {
      colleges.forEach(college => {
        collegeMap.set(college.id, college);
      });
    }

    return reviews.map(review => {
      const college = collegeMap.get(review.college_id);
      
      const currentSessionId = getUserSessionId();
      const reviewSessionId = review.session_id;
      const reviewUserId = review.user_id;
      
      // Check if this is the current user's review
      // For old reviews: check if user_id matches session_id (backward compatibility)
      // For new reviews: check if session_id matches current session
      const isCurrentUser = reviewUserId === currentSessionId || reviewSessionId === currentSessionId;
      
      return {
        id: review.id,
        college_id: review.college_id,
        user_id: review.user_id,
        session_id: reviewSessionId,
        rating: review.rating || 0,
        review_text: review.review_text || '',
        faculty_rating: review.faculty_rating || 1,
        infrastructure_rating: review.infrastructure_rating || 1,
        placements_rating: review.placements_rating || 1,
        helpful_votes: review.helpful_votes || 0,
        verified: review.verified || false,
        created_at: review.created_at || new Date().toISOString(),
        collegeCode: college?.code || 'UNKNOWN',
        collegeName: college?.name || 'Unknown College',
        author: isCurrentUser ? 'You' : `Anonymous User`, // Show "You" for current user's reviews, "Anonymous User" for others
        // Additional fields (using defaults since they don't exist in current schema)
        comment: review.review_text,
        course: '',
        graduation_year: new Date().getFullYear(),
        helpful: review.helpful_votes || 0
      };
    });
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
};

export const loadColleges = async (): Promise<College[]> => {
  try {
    const response = await fetch('/colleges-list.json');
    if (!response.ok) {
      throw new Error('Failed to load colleges data');
    }
    const colleges = await response.json();
    
    // Clean up college names
    return colleges.map((college: College) => ({
      ...college,
      name: college.name
        .replace(/^E:\s*/, '')   // Remove leading "E:" prefix
        .replace(/\s*:\s*$/, '') // Remove trailing ":" and spaces
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim()
    }));
  } catch (error) {
    console.error('Error loading colleges:', error);
    return [];
  }
};

// Load colleges from Supabase database
export const loadCollegesFromSupabase = async (): Promise<College[]> => {
  try {
    const { data: colleges, error } = await supabase
      .from('colleges')
      .select('code, name')
      .order('code', { ascending: true });

    if (error) {
      console.error('❌ Error loading colleges from Supabase:', error);
      // Fallback to JSON file
      return await loadColleges();
    }

    return colleges || [];
  } catch (error) {
    console.error('❌ Error loading colleges from Supabase:', error);
    // Fallback to JSON file
    return await loadColleges();
  }
};

export const loadCollegeReviews = async (): Promise<CollegeReview[]> => {
  try {
    // Always try Supabase first
    const supabaseReviews = await loadReviewsFromSupabase();
    return supabaseReviews;
  } catch (error) {
    console.error('Error loading college reviews from Supabase:', error);
    // Only fallback to localStorage if Supabase completely fails
    return loadReviewsFromLocalStorage();
  }
};

export const getCollegesWithReviews = async (): Promise<{ college: College; reviews: CollegeReview[] }[]> => {
  try {
    // Load colleges from Supabase instead of JSON to ensure all colleges are available
    const colleges = await loadCollegesFromSupabase();
    const allReviews = await loadCollegeReviews();
    
    // Create a map of college codes to college objects for faster lookup
    const collegeCodeMap = new Map();
    colleges.forEach(college => {
      collegeCodeMap.set(college.code, college);
    });
    
    // Group reviews by college code
    const reviewsByCollegeCode = new Map();
    allReviews.forEach(review => {
      if (review.collegeCode && review.collegeCode !== 'UNKNOWN') {
        if (!reviewsByCollegeCode.has(review.collegeCode)) {
          reviewsByCollegeCode.set(review.collegeCode, []);
        }
        reviewsByCollegeCode.get(review.collegeCode).push(review);
      }
    });
    
    // Create result with colleges that have reviews
    const result = colleges.map(college => ({
      college,
      reviews: reviewsByCollegeCode.get(college.code) || []
    }));
    
    // Also add any colleges that have reviews but aren't in the main colleges list
    const collegesWithReviews = Array.from(reviewsByCollegeCode.keys());
    const missingColleges = collegesWithReviews.filter(code => !collegeCodeMap.has(code));
    
    if (missingColleges.length > 0) {
      // Add these colleges to the result
      missingColleges.forEach(code => {
        const reviews = reviewsByCollegeCode.get(code);
        if (reviews && reviews.length > 0) {
          // Create a college object from the first review
          const firstReview = reviews[0];
          result.push({
            college: {
              code: code,
              name: firstReview.collegeName || `College ${code}`
            },
            reviews: reviews
          });
        }
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error loading colleges with reviews:', error);
    return [];
  }
};

export const saveReviewToSupabase = async (reviewData: {
  collegeCode: string;
  rating: number;
  review_text: string;
  faculty_rating: number;
  infrastructure_rating: number;
  placements_rating: number;
  user_id?: string;
  comment?: string;
  course?: string;
  graduation_year?: number;
}): Promise<CollegeReview | null> => {
  try {
    
    // First, check if the college exists in the database
    let { data: collegeData, error: collegeError } = await supabase
      .from('colleges')
      .select('id')
      .eq('code', reviewData.collegeCode)
      .single();

    if (collegeError || !collegeData) {
      console.error('College error:', collegeError);
      // Fallback to localStorage
      return saveToLocalStorage(reviewData);
    }

    // Use the user session ID for tracking user's own reviews
    const userSessionId = getUserSessionId();
    const { data, error } = await supabase
      .from('college_reviews')
      .insert({
        college_id: collegeData.id,
        session_id: userSessionId, // Use session_id for anonymous users
        rating: reviewData.rating,
        review_text: reviewData.review_text,
        faculty_rating: reviewData.faculty_rating,
        infrastructure_rating: reviewData.infrastructure_rating,
        placements_rating: reviewData.placements_rating,
        helpful_votes: 0,
        verified: false,
        // Note: Additional fields like comment, course, graduation_year are not available in current schema
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving review to Supabase:', error);
      // Fallback to localStorage
      return saveToLocalStorage(reviewData);
    }
    return {
      id: data.id,
      college_id: data.college_id,
      user_id: data.user_id,
      session_id: data.session_id,
      rating: data.rating || 0,
      review_text: data.review_text || '',
      faculty_rating: data.faculty_rating || 1,
      infrastructure_rating: data.infrastructure_rating || 1,
      placements_rating: data.placements_rating || 1,
      helpful_votes: data.helpful_votes || 0,
      verified: data.verified || false,
      created_at: data.created_at || new Date().toISOString(),
      collegeCode: reviewData.collegeCode,
      author: `You`, // Since this is the current user's review
      // Additional fields (using defaults since they don't exist in current schema)
      comment: data.review_text,
      course: '',
      graduation_year: new Date().getFullYear(),
      helpful: data.helpful_votes || 0
    };
  } catch (error) {
    console.error('Error saving review:', error);
    // Fallback to localStorage
    return saveToLocalStorage(reviewData);
  }
};

// Helper function to save to localStorage as fallback
const saveToLocalStorage = (reviewData: {
  collegeCode: string;
  rating: number;
  review_text: string;
  faculty_rating: number;
  infrastructure_rating: number;
  placements_rating: number;
  user_id?: string;
  comment?: string;
  course?: string;
  graduation_year?: number;
}): CollegeReview => {
  
  const mockReview: CollegeReview = {
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    college_id: `college_${reviewData.collegeCode}`,
    session_id: getUserSessionId(),
    rating: reviewData.rating,
    review_text: reviewData.review_text,
    faculty_rating: reviewData.faculty_rating,
    infrastructure_rating: reviewData.infrastructure_rating,
    placements_rating: reviewData.placements_rating,
    helpful_votes: 0,
    verified: false,
    created_at: new Date().toISOString(),
    collegeCode: reviewData.collegeCode,
    author: `You`,
    // Additional fields
    comment: reviewData.comment || reviewData.review_text,
    course: reviewData.course,
    graduation_year: reviewData.graduation_year,
    helpful: 0
  };

  // Store in localStorage for persistence during session
  const existingReviews = JSON.parse(localStorage.getItem('local_reviews') || '[]');
  existingReviews.push(mockReview);
  localStorage.setItem('local_reviews', JSON.stringify(existingReviews));
  
  return mockReview;
};

// Delete review from Supabase
export const deleteReviewFromSupabase = async (reviewId: string): Promise<boolean> => {
  try {
    
    const { error } = await supabase
      .from('college_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review from Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};

// Delete review from localStorage
const deleteFromLocalStorage = (reviewId: string): boolean => {
  try {
    const existingReviews = JSON.parse(localStorage.getItem('local_reviews') || '[]');
    const updatedReviews = existingReviews.filter((review: CollegeReview) => review.id !== reviewId);
    
    localStorage.setItem('local_reviews', JSON.stringify(updatedReviews));
    
    return true;
  } catch (error) {
    console.error('Error deleting review from localStorage:', error);
    return false;
  }
};

// Check if a review belongs to the current user
export const isUserReview = (review: CollegeReview): boolean => {
  const userSessionId = getUserSessionId();
  const reviewUserId = review.user_id;
  const reviewSessionId = review.session_id;
  
  // For backward compatibility: old reviews use user_id as session_id
  // For new reviews: use session_id field
  const isCurrentUser = reviewUserId === userSessionId || reviewSessionId === userSessionId;
  return isCurrentUser;
};

// Main delete function that tries Supabase first, then localStorage
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    // Try Supabase first
    const supabaseSuccess = await deleteReviewFromSupabase(reviewId);
    if (supabaseSuccess) {
      return true;
    }
    
    // Fallback to localStorage
    return deleteFromLocalStorage(reviewId);
  } catch (error) {
    console.error('Error deleting review:', error);
    // Fallback to localStorage
    return deleteFromLocalStorage(reviewId);
  }
};
