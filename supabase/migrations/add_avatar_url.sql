-- Add avatar_url column to staff_admin table if it doesn't exist
ALTER TABLE public.staff_admin 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
