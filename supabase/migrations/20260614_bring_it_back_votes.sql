-- Table to track students who want the platform back
CREATE TABLE IF NOT EXISTS public.bring_it_back_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,  -- browser fingerprint to prevent duplicates
    message TEXT,                      -- optional message from the voter
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bring_it_back_votes ENABLE ROW LEVEL SECURITY;

-- Everyone can view votes (for real-time count)
CREATE POLICY "Votes are viewable by everyone"
ON public.bring_it_back_votes FOR SELECT
USING (true);

-- Anyone can insert a vote (anonymous)
CREATE POLICY "Anyone can vote"
ON public.bring_it_back_votes FOR INSERT
WITH CHECK (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bring_it_back_votes;
