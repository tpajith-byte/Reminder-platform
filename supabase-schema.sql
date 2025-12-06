-- Drop existing reminders table to rebuild with new schema
DROP TABLE IF EXISTS public.reminders;

-- Create reminders table with new schema
CREATE TABLE public.reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN (
        'Vehicle insurance',
        'Vehicle Pollution',
        'Vehicle Registration',
        'Vehicle service',
        'Passport',
        'Vaccination',
        'Land Tax',
        'Property Tax',
        'Others'
    )),
    other_reminder_type TEXT,
    document_name TEXT NOT NULL,
    document_description TEXT,
    expiry_date DATE NOT NULL,
    reminder_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_reminders_user_id ON public.reminders(user_id);

-- Create index on reminder_date for sorting
CREATE INDEX idx_reminders_reminder_date ON public.reminders(reminder_date);

-- Create index on expiry_date for sorting
CREATE INDEX idx_reminders_expiry_date ON public.reminders(expiry_date);

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
