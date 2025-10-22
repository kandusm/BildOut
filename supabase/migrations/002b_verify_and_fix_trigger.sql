-- ============================================
-- Verify and Fix Auth Trigger
-- Migration 002
-- ============================================

-- First, let's check if the trigger exists
-- Run this query first to see what we have:
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Drop the trigger if it exists (to recreate it)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function if it exists (to recreate it)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_org_id uuid;
BEGIN
  -- Create organization
  INSERT INTO public.organizations (name, owner_id)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'business_name', 'My Business'),
    new.id
  )
  RETURNING id INTO new_org_id;

  -- Create user profile
  INSERT INTO public.users (id, org_id, role, display_name)
  VALUES (
    new.id,
    new_org_id,
    'owner',
    COALESCE(new.raw_user_meta_data->>'display_name', new.email)
  );

  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Verify the trigger was created
SELECT
  trigger_schema,
  trigger_name,
  event_object_schema,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
