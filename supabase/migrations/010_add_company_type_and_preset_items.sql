-- ============================================
-- Add Company Type and Preset Items
-- Migration 010
-- ============================================

-- Add company_type column to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS company_type text;

-- Add comment to document the column
COMMENT ON COLUMN organizations.company_type IS 'Type of company (construction, plumbing, electrical, landscaping, hvac, roofing, painting, carpentry, cleaning, consulting, other)';

-- Set default company_type for existing organizations to 'other'
UPDATE organizations SET company_type = 'other' WHERE company_type IS NULL;

-- Drop existing trigger and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.seed_preset_items(uuid, text);

-- First, create the seed_preset_items function
CREATE OR REPLACE FUNCTION public.seed_preset_items(
  p_org_id uuid,
  p_company_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Seed items based on company type
  CASE p_company_type
    WHEN 'construction' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Labor - General Construction', 'Hourly rate for general construction work', 75.00, 'Labor'),
        (p_org_id, 'Labor - Skilled Tradesperson', 'Hourly rate for skilled trade work', 95.00, 'Labor'),
        (p_org_id, 'Materials - Lumber', 'Wood and lumber materials', 0, 'Materials'),
        (p_org_id, 'Materials - Concrete', 'Concrete and related materials', 0, 'Materials'),
        (p_org_id, 'Equipment Rental', 'Construction equipment rental', 0, 'Equipment'),
        (p_org_id, 'Site Preparation', 'Site prep and cleanup', 500.00, 'Services'),
        (p_org_id, 'Permits and Fees', 'Building permits and inspection fees', 0, 'Fees');

    WHEN 'plumbing' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Service Call', 'Standard service call fee', 95.00, 'Service'),
        (p_org_id, 'Labor - Plumbing', 'Hourly rate for plumbing work', 125.00, 'Labor'),
        (p_org_id, 'Pipe Repair/Replacement', 'Pipe repair or replacement service', 250.00, 'Repair'),
        (p_org_id, 'Drain Cleaning', 'Drain cleaning service', 175.00, 'Service'),
        (p_org_id, 'Fixture Installation', 'Install sink, toilet, or fixture', 350.00, 'Installation'),
        (p_org_id, 'Water Heater Service', 'Water heater repair or installation', 850.00, 'Service'),
        (p_org_id, 'Parts & Materials', 'Plumbing parts and materials', 0, 'Materials');

    WHEN 'electrical' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Service Call', 'Standard service call fee', 100.00, 'Service'),
        (p_org_id, 'Labor - Electrical', 'Hourly rate for electrical work', 135.00, 'Labor'),
        (p_org_id, 'Outlet Installation', 'Install new electrical outlet', 150.00, 'Installation'),
        (p_org_id, 'Light Fixture Installation', 'Install light fixture', 200.00, 'Installation'),
        (p_org_id, 'Circuit Breaker Replacement', 'Replace circuit breaker', 275.00, 'Repair'),
        (p_org_id, 'Panel Upgrade', 'Electrical panel upgrade', 1800.00, 'Installation'),
        (p_org_id, 'Wiring & Materials', 'Electrical wiring and materials', 0, 'Materials');

    WHEN 'landscaping' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Lawn Mowing', 'Standard lawn mowing service', 45.00, 'Maintenance'),
        (p_org_id, 'Trimming & Edging', 'Trimming and edging service', 35.00, 'Maintenance'),
        (p_org_id, 'Mulching', 'Mulch installation per cubic yard', 65.00, 'Installation'),
        (p_org_id, 'Tree Trimming', 'Tree trimming and pruning', 300.00, 'Tree Service'),
        (p_org_id, 'Planting', 'Plant installation', 85.00, 'Installation'),
        (p_org_id, 'Landscape Design', 'Landscape design consultation', 500.00, 'Design'),
        (p_org_id, 'Plants & Materials', 'Plants, soil, and materials', 0, 'Materials');

    WHEN 'hvac' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Service Call', 'Standard HVAC service call', 95.00, 'Service'),
        (p_org_id, 'Labor - HVAC Technician', 'Hourly rate for HVAC work', 125.00, 'Labor'),
        (p_org_id, 'AC Tune-Up', 'Air conditioning tune-up and maintenance', 150.00, 'Maintenance'),
        (p_org_id, 'Furnace Inspection', 'Furnace inspection and service', 125.00, 'Maintenance'),
        (p_org_id, 'Filter Replacement', 'Replace HVAC filter', 75.00, 'Service'),
        (p_org_id, 'AC Installation', 'New air conditioning unit installation', 3500.00, 'Installation'),
        (p_org_id, 'Parts & Materials', 'HVAC parts and materials', 0, 'Materials');

    WHEN 'roofing' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Roof Inspection', 'Complete roof inspection', 200.00, 'Service'),
        (p_org_id, 'Labor - Roofing', 'Hourly rate for roofing work', 85.00, 'Labor'),
        (p_org_id, 'Shingle Installation', 'Asphalt shingle installation per square', 425.00, 'Installation'),
        (p_org_id, 'Roof Repair', 'Roof repair service', 350.00, 'Repair'),
        (p_org_id, 'Gutter Installation', 'Gutter installation per linear foot', 18.00, 'Installation'),
        (p_org_id, 'Tear-Off & Disposal', 'Old roof removal and disposal', 0, 'Service'),
        (p_org_id, 'Roofing Materials', 'Shingles, underlayment, and materials', 0, 'Materials');

    WHEN 'painting' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Labor - Painting', 'Hourly rate for painting', 55.00, 'Labor'),
        (p_org_id, 'Interior Painting', 'Interior painting per square foot', 2.50, 'Service'),
        (p_org_id, 'Exterior Painting', 'Exterior painting per square foot', 3.25, 'Service'),
        (p_org_id, 'Trim & Baseboards', 'Paint trim and baseboards', 4.00, 'Service'),
        (p_org_id, 'Ceiling Painting', 'Ceiling painting per square foot', 1.75, 'Service'),
        (p_org_id, 'Surface Preparation', 'Prep, sanding, and repair', 250.00, 'Prep'),
        (p_org_id, 'Paint & Supplies', 'Paint and painting supplies', 0, 'Materials');

    WHEN 'carpentry' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Labor - Carpentry', 'Hourly rate for carpentry work', 75.00, 'Labor'),
        (p_org_id, 'Custom Cabinetry', 'Custom cabinet construction', 3000.00, 'Custom Work'),
        (p_org_id, 'Trim Installation', 'Install crown molding and trim', 12.00, 'Installation'),
        (p_org_id, 'Door Installation', 'Install interior or exterior door', 400.00, 'Installation'),
        (p_org_id, 'Deck Construction', 'Deck building per square foot', 35.00, 'Construction'),
        (p_org_id, 'Furniture Repair', 'Furniture repair service', 150.00, 'Repair'),
        (p_org_id, 'Wood & Materials', 'Lumber and materials', 0, 'Materials');

    WHEN 'cleaning' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Standard Cleaning', 'Standard house cleaning', 150.00, 'Service'),
        (p_org_id, 'Deep Cleaning', 'Deep cleaning service', 300.00, 'Service'),
        (p_org_id, 'Move-In/Move-Out Cleaning', 'Move-in or move-out cleaning', 350.00, 'Service'),
        (p_org_id, 'Carpet Cleaning', 'Carpet cleaning per room', 75.00, 'Service'),
        (p_org_id, 'Window Cleaning', 'Window cleaning service', 125.00, 'Service'),
        (p_org_id, 'Commercial Cleaning', 'Commercial space cleaning', 0.35, 'Service'),
        (p_org_id, 'Cleaning Supplies', 'Cleaning products and supplies', 0, 'Supplies');

    WHEN 'consulting' THEN
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Hourly Consulting', 'Hourly consulting rate', 175.00, 'Consulting'),
        (p_org_id, 'Project Fee', 'Fixed project fee', 5000.00, 'Project'),
        (p_org_id, 'Strategy Session', '2-hour strategy session', 450.00, 'Consulting'),
        (p_org_id, 'Research & Analysis', 'Research and analysis work', 150.00, 'Research'),
        (p_org_id, 'Report Preparation', 'Written report preparation', 750.00, 'Deliverable'),
        (p_org_id, 'Retainer - Monthly', 'Monthly retainer fee', 3000.00, 'Retainer'),
        (p_org_id, 'Travel Expenses', 'Travel and expenses', 0, 'Expenses');

    ELSE
      -- 'other' or any unrecognized type
      INSERT INTO public.items (org_id, name, description, unit_price, category)
      VALUES
        (p_org_id, 'Service Fee', 'Standard service fee', 100.00, 'Service'),
        (p_org_id, 'Hourly Rate', 'Hourly rate for services', 75.00, 'Labor'),
        (p_org_id, 'Materials', 'Materials and supplies', 0, 'Materials'),
        (p_org_id, 'Consultation', 'Consultation fee', 150.00, 'Consulting'),
        (p_org_id, 'Project Fee', 'Fixed project fee', 1000.00, 'Project');
  END CASE;
END;
$$;

-- Now create the handle_new_user function (which calls seed_preset_items)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_org_id uuid;
  v_company_type text;
BEGIN
  -- Get company type from metadata or default to 'other'
  v_company_type := COALESCE(new.raw_user_meta_data->>'company_type', 'other');

  -- Create organization with company_type
  INSERT INTO public.organizations (name, owner_id, company_type)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'business_name', 'My Business'),
    new.id,
    v_company_type
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

  -- Seed preset items based on company type
  PERFORM public.seed_preset_items(new_org_id, v_company_type);

  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
