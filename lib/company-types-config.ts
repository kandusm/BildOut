// Company types and their preset invoice items

export const COMPANY_TYPES = {
  CONSTRUCTION: 'construction',
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  LANDSCAPING: 'landscaping',
  HVAC: 'hvac',
  ROOFING: 'roofing',
  PAINTING: 'painting',
  CARPENTRY: 'carpentry',
  CLEANING: 'cleaning',
  CONSULTING: 'consulting',
  OTHER: 'other',
} as const

export type CompanyType = typeof COMPANY_TYPES[keyof typeof COMPANY_TYPES]

export interface CompanyTypeOption {
  value: CompanyType
  label: string
  icon: string
  description: string
}

export const COMPANY_TYPE_OPTIONS: CompanyTypeOption[] = [
  {
    value: 'construction',
    label: 'Construction',
    icon: '🏗️',
    description: 'General contractors, builders, and construction companies',
  },
  {
    value: 'plumbing',
    label: 'Plumbing',
    icon: '🔧',
    description: 'Plumbers and plumbing contractors',
  },
  {
    value: 'electrical',
    label: 'Electrical',
    icon: '⚡',
    description: 'Electricians and electrical contractors',
  },
  {
    value: 'landscaping',
    label: 'Landscaping',
    icon: '🌳',
    description: 'Landscapers and lawn care professionals',
  },
  {
    value: 'hvac',
    label: 'HVAC',
    icon: '❄️',
    description: 'HVAC technicians and contractors',
  },
  {
    value: 'roofing',
    label: 'Roofing',
    icon: '🏠',
    description: 'Roofing contractors and repair services',
  },
  {
    value: 'painting',
    label: 'Painting',
    icon: '🎨',
    description: 'Painters and decorators',
  },
  {
    value: 'carpentry',
    label: 'Carpentry',
    icon: '🪚',
    description: 'Carpenters and woodworkers',
  },
  {
    value: 'cleaning',
    label: 'Cleaning',
    icon: '🧹',
    description: 'Cleaning and janitorial services',
  },
  {
    value: 'consulting',
    label: 'Consulting',
    icon: '💼',
    description: 'Consultants and professional services',
  },
  {
    value: 'other',
    label: 'Other',
    icon: '📋',
    description: 'Other business types',
  },
]

// Preset invoice items for each company type
export interface PresetItem {
  name: string
  description: string
  unit_price: number
  category?: string
}

export const PRESET_ITEMS: Record<CompanyType, PresetItem[]> = {
  construction: [
    { name: 'Labor - General Construction', description: 'Hourly rate for general construction work', unit_price: 75.00, category: 'Labor' },
    { name: 'Labor - Skilled Tradesperson', description: 'Hourly rate for skilled trade work', unit_price: 95.00, category: 'Labor' },
    { name: 'Materials - Lumber', description: 'Wood and lumber materials', unit_price: 0, category: 'Materials' },
    { name: 'Materials - Concrete', description: 'Concrete and related materials', unit_price: 0, category: 'Materials' },
    { name: 'Equipment Rental', description: 'Construction equipment rental', unit_price: 0, category: 'Equipment' },
    { name: 'Site Preparation', description: 'Site prep and cleanup', unit_price: 500.00, category: 'Services' },
    { name: 'Permits and Fees', description: 'Building permits and inspection fees', unit_price: 0, category: 'Fees' },
  ],
  plumbing: [
    { name: 'Service Call', description: 'Standard service call fee', unit_price: 95.00, category: 'Service' },
    { name: 'Labor - Plumbing', description: 'Hourly rate for plumbing work', unit_price: 125.00, category: 'Labor' },
    { name: 'Pipe Repair/Replacement', description: 'Pipe repair or replacement service', unit_price: 250.00, category: 'Repair' },
    { name: 'Drain Cleaning', description: 'Drain cleaning service', unit_price: 175.00, category: 'Service' },
    { name: 'Fixture Installation', description: 'Install sink, toilet, or fixture', unit_price: 350.00, category: 'Installation' },
    { name: 'Water Heater Service', description: 'Water heater repair or installation', unit_price: 850.00, category: 'Service' },
    { name: 'Parts & Materials', description: 'Plumbing parts and materials', unit_price: 0, category: 'Materials' },
  ],
  electrical: [
    { name: 'Service Call', description: 'Standard service call fee', unit_price: 100.00, category: 'Service' },
    { name: 'Labor - Electrical', description: 'Hourly rate for electrical work', unit_price: 135.00, category: 'Labor' },
    { name: 'Outlet Installation', description: 'Install new electrical outlet', unit_price: 150.00, category: 'Installation' },
    { name: 'Light Fixture Installation', description: 'Install light fixture', unit_price: 200.00, category: 'Installation' },
    { name: 'Circuit Breaker Replacement', description: 'Replace circuit breaker', unit_price: 275.00, category: 'Repair' },
    { name: 'Panel Upgrade', description: 'Electrical panel upgrade', unit_price: 1800.00, category: 'Installation' },
    { name: 'Wiring & Materials', description: 'Electrical wiring and materials', unit_price: 0, category: 'Materials' },
  ],
  landscaping: [
    { name: 'Lawn Mowing', description: 'Standard lawn mowing service', unit_price: 45.00, category: 'Maintenance' },
    { name: 'Trimming & Edging', description: 'Trimming and edging service', unit_price: 35.00, category: 'Maintenance' },
    { name: 'Mulching', description: 'Mulch installation per cubic yard', unit_price: 65.00, category: 'Installation' },
    { name: 'Tree Trimming', description: 'Tree trimming and pruning', unit_price: 300.00, category: 'Tree Service' },
    { name: 'Planting', description: 'Plant installation', unit_price: 85.00, category: 'Installation' },
    { name: 'Landscape Design', description: 'Landscape design consultation', unit_price: 500.00, category: 'Design' },
    { name: 'Plants & Materials', description: 'Plants, soil, and materials', unit_price: 0, category: 'Materials' },
  ],
  hvac: [
    { name: 'Service Call', description: 'Standard HVAC service call', unit_price: 95.00, category: 'Service' },
    { name: 'Labor - HVAC Technician', description: 'Hourly rate for HVAC work', unit_price: 125.00, category: 'Labor' },
    { name: 'AC Tune-Up', description: 'Air conditioning tune-up and maintenance', unit_price: 150.00, category: 'Maintenance' },
    { name: 'Furnace Inspection', description: 'Furnace inspection and service', unit_price: 125.00, category: 'Maintenance' },
    { name: 'Filter Replacement', description: 'Replace HVAC filter', unit_price: 75.00, category: 'Service' },
    { name: 'AC Installation', description: 'New air conditioning unit installation', unit_price: 3500.00, category: 'Installation' },
    { name: 'Parts & Materials', description: 'HVAC parts and materials', unit_price: 0, category: 'Materials' },
  ],
  roofing: [
    { name: 'Roof Inspection', description: 'Complete roof inspection', unit_price: 200.00, category: 'Service' },
    { name: 'Labor - Roofing', description: 'Hourly rate for roofing work', unit_price: 85.00, category: 'Labor' },
    { name: 'Shingle Installation', description: 'Asphalt shingle installation per square', unit_price: 425.00, category: 'Installation' },
    { name: 'Roof Repair', description: 'Roof repair service', unit_price: 350.00, category: 'Repair' },
    { name: 'Gutter Installation', description: 'Gutter installation per linear foot', unit_price: 18.00, category: 'Installation' },
    { name: 'Tear-Off & Disposal', description: 'Old roof removal and disposal', unit_price: 0, category: 'Service' },
    { name: 'Roofing Materials', description: 'Shingles, underlayment, and materials', unit_price: 0, category: 'Materials' },
  ],
  painting: [
    { name: 'Labor - Painting', description: 'Hourly rate for painting', unit_price: 55.00, category: 'Labor' },
    { name: 'Interior Painting', description: 'Interior painting per square foot', unit_price: 2.50, category: 'Service' },
    { name: 'Exterior Painting', description: 'Exterior painting per square foot', unit_price: 3.25, category: 'Service' },
    { name: 'Trim & Baseboards', description: 'Paint trim and baseboards', unit_price: 4.00, category: 'Service' },
    { name: 'Ceiling Painting', description: 'Ceiling painting per square foot', unit_price: 1.75, category: 'Service' },
    { name: 'Surface Preparation', description: 'Prep, sanding, and repair', unit_price: 250.00, category: 'Prep' },
    { name: 'Paint & Supplies', description: 'Paint and painting supplies', unit_price: 0, category: 'Materials' },
  ],
  carpentry: [
    { name: 'Labor - Carpentry', description: 'Hourly rate for carpentry work', unit_price: 75.00, category: 'Labor' },
    { name: 'Custom Cabinetry', description: 'Custom cabinet construction', unit_price: 3000.00, category: 'Custom Work' },
    { name: 'Trim Installation', description: 'Install crown molding and trim', unit_price: 12.00, category: 'Installation' },
    { name: 'Door Installation', description: 'Install interior or exterior door', unit_price: 400.00, category: 'Installation' },
    { name: 'Deck Construction', description: 'Deck building per square foot', unit_price: 35.00, category: 'Construction' },
    { name: 'Furniture Repair', description: 'Furniture repair service', unit_price: 150.00, category: 'Repair' },
    { name: 'Wood & Materials', description: 'Lumber and materials', unit_price: 0, category: 'Materials' },
  ],
  cleaning: [
    { name: 'Standard Cleaning', description: 'Standard house cleaning', unit_price: 150.00, category: 'Service' },
    { name: 'Deep Cleaning', description: 'Deep cleaning service', unit_price: 300.00, category: 'Service' },
    { name: 'Move-In/Move-Out Cleaning', description: 'Move-in or move-out cleaning', unit_price: 350.00, category: 'Service' },
    { name: 'Carpet Cleaning', description: 'Carpet cleaning per room', unit_price: 75.00, category: 'Service' },
    { name: 'Window Cleaning', description: 'Window cleaning service', unit_price: 125.00, category: 'Service' },
    { name: 'Commercial Cleaning', description: 'Commercial space cleaning', unit_price: 0.35, category: 'Service' },
    { name: 'Cleaning Supplies', description: 'Cleaning products and supplies', unit_price: 0, category: 'Supplies' },
  ],
  consulting: [
    { name: 'Hourly Consulting', description: 'Hourly consulting rate', unit_price: 175.00, category: 'Consulting' },
    { name: 'Project Fee', description: 'Fixed project fee', unit_price: 5000.00, category: 'Project' },
    { name: 'Strategy Session', description: '2-hour strategy session', unit_price: 450.00, category: 'Consulting' },
    { name: 'Research & Analysis', description: 'Research and analysis work', unit_price: 150.00, category: 'Research' },
    { name: 'Report Preparation', description: 'Written report preparation', unit_price: 750.00, category: 'Deliverable' },
    { name: 'Retainer - Monthly', description: 'Monthly retainer fee', unit_price: 3000.00, category: 'Retainer' },
    { name: 'Travel Expenses', description: 'Travel and expenses', unit_price: 0, category: 'Expenses' },
  ],
  other: [
    { name: 'Service Fee', description: 'Standard service fee', unit_price: 100.00, category: 'Service' },
    { name: 'Hourly Rate', description: 'Hourly rate for services', unit_price: 75.00, category: 'Labor' },
    { name: 'Materials', description: 'Materials and supplies', unit_price: 0, category: 'Materials' },
    { name: 'Consultation', description: 'Consultation fee', unit_price: 150.00, category: 'Consulting' },
    { name: 'Project Fee', description: 'Fixed project fee', unit_price: 1000.00, category: 'Project' },
  ],
}
