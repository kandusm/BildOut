-- ============================================
-- Add Category Column to Items Table
-- Migration 009b
-- This must run BEFORE migration 010 which inserts preset items with categories
-- ============================================

-- Add category column to items table
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS category text;

-- Add comment to document the column
COMMENT ON COLUMN public.items.category IS 'Category of the item (Labor, Materials, Service, etc.)';

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS items_category_idx ON public.items (category);
