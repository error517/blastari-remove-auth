-- Create website_analyses table
CREATE TABLE IF NOT EXISTS website_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    website_url TEXT NOT NULL,
    product_overview TEXT NOT NULL,
    core_value_proposition TEXT NOT NULL,
    target_audience_type TEXT NOT NULL,
    target_audience_segments TEXT[] NOT NULL,
    current_stage TEXT NOT NULL,
    goals TEXT[] NOT NULL,
    suggested_budget TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    constraints TEXT[] NOT NULL,
    preferred_channels TEXT[] NOT NULL,
    tone_and_personality TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on website_url for faster lookups
CREATE INDEX IF NOT EXISTS website_analyses_url_idx ON website_analyses(website_url);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS website_analyses_created_at_idx ON website_analyses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE website_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since we're not using auth)
CREATE POLICY "Allow all operations"
    ON website_analyses
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_website_analyses_updated_at
    BEFORE UPDATE ON website_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 