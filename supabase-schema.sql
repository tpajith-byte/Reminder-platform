-- Enable PostGIS extension (for geolocation features)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reminder_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    location_point GEOGRAPHY(POINT, 4326), -- PostGIS geography column for lat/lng
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);

-- Create index on reminder_date for sorting
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(reminder_date);

-- Create spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_reminders_location ON public.reminders USING GIST(location_point);

-- Enable Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own reminders
CREATE POLICY "Users can view their own reminders"
    ON public.reminders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own reminders
CREATE POLICY "Users can insert their own reminders"
    ON public.reminders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own reminders
CREATE POLICY "Users can update their own reminders"
    ON public.reminders
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own reminders
CREATE POLICY "Users can delete their own reminders"
    ON public.reminders
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
