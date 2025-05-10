-- Create website_analyses table
CREATE TABLE IF NOT EXISTS website_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS website_analyses_user_id_idx ON website_analyses(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS website_analyses_created_at_idx ON website_analyses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE website_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own analyses
CREATE POLICY "Users can view their own analyses"
    ON website_analyses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own analyses
CREATE POLICY "Users can insert their own analyses"
    ON website_analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own analyses
CREATE POLICY "Users can update their own analyses"
    ON website_analyses
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own analyses
CREATE POLICY "Users can delete their own analyses"
    ON website_analyses
    FOR DELETE
    USING (auth.uid() = user_id);

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