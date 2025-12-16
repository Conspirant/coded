-- Create enum types for better data integrity
CREATE TYPE public.category_type AS ENUM ('1G', '2A', '2B', '3A', '3B', 'GM', 'SC', 'ST');
CREATE TYPE public.seat_type AS ENUM ('government', 'management', 'nri', 'comed_k');
CREATE TYPE public.quota_type AS ENUM ('general', 'rural', 'hyderabad_karnataka', 'horanadu', 'gadinadu');
CREATE TYPE public.user_role AS ENUM ('student', 'admin');

-- Users table for authentication and profiles
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    category category_type,
    expected_rank INTEGER,
    marks INTEGER,
    subject_marks JSONB, -- Store subject-wise marks
    preferences TEXT[], -- Array of college-branch preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Colleges master data
CREATE TABLE public.colleges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    district TEXT,
    type TEXT, -- engineering, medical, etc
    established_year INTEGER,
    website TEXT,
    fees_structure JSONB,
    facilities JSONB,
    placement_stats JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branches master data
CREATE TABLE public.branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT, -- CSE, ECE, Mechanical, etc
    duration INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historical cutoffs data
CREATE TABLE public.cutoffs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) NOT NULL,
    branch_id UUID REFERENCES public.branches(id) NOT NULL,
    year INTEGER NOT NULL,
    round INTEGER DEFAULT 1,
    category category_type NOT NULL,
    seat_type seat_type NOT NULL,
    quota_type quota_type DEFAULT 'general',
    opening_rank INTEGER,
    closing_rank INTEGER NOT NULL,
    seats_available INTEGER,
    source_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(college_id, branch_id, year, round, category, seat_type, quota_type)
);

-- Seat matrix data
CREATE TABLE public.seat_matrix (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) NOT NULL,
    branch_id UUID REFERENCES public.branches(id) NOT NULL,
    year INTEGER NOT NULL,
    category category_type NOT NULL,
    quota_type quota_type DEFAULT 'general',
    seats_total INTEGER NOT NULL,
    seats_filled INTEGER DEFAULT 0,
    seats_remaining INTEGER GENERATED ALWAYS AS (seats_total - seats_filled) STORED,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(college_id, branch_id, year, category, quota_type)
);

-- Rank predictions history
CREATE TABLE public.rank_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    marks INTEGER NOT NULL,
    subject_marks JSONB,
    category category_type NOT NULL,
    predicted_rank_min INTEGER NOT NULL,
    predicted_rank_max INTEGER NOT NULL,
    confidence_score DECIMAL(3,2),
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock allotment simulations
CREATE TABLE public.mock_simulations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    rank INTEGER NOT NULL,
    category category_type NOT NULL,
    preferences JSONB NOT NULL, -- Array of {college_id, branch_id, priority}
    simulation_result JSONB, -- Result of simulation
    round_results JSONB, -- Round-wise results
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- College reviews
CREATE TABLE public.college_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id UUID REFERENCES public.colleges(id) NOT NULL,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    placements_rating INTEGER CHECK (placements_rating >= 1 AND placements_rating <= 5),
    faculty_rating INTEGER CHECK (faculty_rating >= 1 AND faculty_rating <= 5),
    infrastructure_rating INTEGER CHECK (infrastructure_rating >= 1 AND infrastructure_rating <= 5),
    verified BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification subscriptions
CREATE TABLE public.notification_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    subscription_type TEXT NOT NULL, -- round_updates, cutoff_alerts, etc
    filters JSONB, -- specific colleges, categories, etc
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity log
CREATE TABLE public.admin_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.users(id) NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;

-- RLS policies for users
CREATE POLICY "Users can view and update their own profile" 
ON public.users FOR ALL 
USING (auth.uid() = id);

-- RLS policies for public read access to master data
CREATE POLICY "Anyone can view colleges" 
ON public.colleges FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view branches" 
ON public.branches FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view cutoffs" 
ON public.cutoffs FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view seat matrix" 
ON public.seat_matrix FOR SELECT 
USING (true);

-- RLS policies for user-specific data
CREATE POLICY "Users can manage their own predictions" 
ON public.rank_predictions FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own simulations" 
ON public.mock_simulations FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reviews" 
ON public.college_reviews FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view reviews" 
ON public.college_reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own subscriptions" 
ON public.notification_subscriptions FOR ALL 
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_cutoffs_college_branch ON public.cutoffs(college_id, branch_id);
CREATE INDEX idx_cutoffs_year_category ON public.cutoffs(year, category);
CREATE INDEX idx_cutoffs_closing_rank ON public.cutoffs(closing_rank);
CREATE INDEX idx_seat_matrix_college_branch ON public.seat_matrix(college_id, branch_id);
CREATE INDEX idx_colleges_name ON public.colleges USING gin(to_tsvector('english', name));
CREATE INDEX idx_branches_name ON public.branches USING gin(to_tsvector('english', name));

-- Functions for data analysis
CREATE OR REPLACE FUNCTION public.get_rank_prediction(
    input_marks INTEGER,
    input_category category_type,
    target_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER
)
RETURNS TABLE(
    predicted_rank_min INTEGER,
    predicted_rank_max INTEGER,
    confidence_score DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    historical_data RECORD;
    rank_estimate INTEGER;
    rank_variance INTEGER;
BEGIN
    -- Simple historical correlation approach
    -- In production, this would use more sophisticated ML models
    
    SELECT 
        AVG(closing_rank) as avg_rank,
        STDDEV(closing_rank) as std_rank
    INTO historical_data
    FROM public.cutoffs
    WHERE year >= target_year - 3
    AND category = input_category;
    
    -- Simplified rank estimation based on marks
    -- This is a placeholder - real implementation would use complex algorithms
    rank_estimate := GREATEST(1, 200000 - (input_marks * 150));
    rank_variance := COALESCE(historical_data.std_rank::INTEGER, 5000);
    
    RETURN QUERY SELECT 
        GREATEST(1, rank_estimate - rank_variance) as predicted_rank_min,
        rank_estimate + rank_variance as predicted_rank_max,
        0.75::DECIMAL as confidence_score;
END;
$$;