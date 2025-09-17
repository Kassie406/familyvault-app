-- Supabase Database Setup for Family Portal Authentication
-- Run these commands in your Supabase SQL Editor

-- 1. Create profiles table for user family assignments
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (id = auth.uid());

-- 2. Create list_items table for Shared Lists feature
CREATE TABLE IF NOT EXISTS public.list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  assignee TEXT,
  due_date DATE,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for list_items
ALTER TABLE public.list_items ENABLE ROW LEVEL SECURITY;

-- List items policies - family members can access items for their family
CREATE POLICY "Family members can read list items" 
ON public.list_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.id = auth.uid() 
  AND p.family_id = list_items.family_id
));

CREATE POLICY "Family members can insert list items" 
ON public.list_items FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.id = auth.uid() 
  AND p.family_id = list_items.family_id
));

CREATE POLICY "Family members can update list items" 
ON public.list_items FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.id = auth.uid() 
  AND p.family_id = list_items.family_id
));

CREATE POLICY "Family members can delete list items" 
ON public.list_items FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  WHERE p.id = auth.uid() 
  AND p.family_id = list_items.family_id
));

-- 3. Optional: Create a function to automatically create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, family_id, name)
  VALUES (NEW.id, 'fam_default', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();