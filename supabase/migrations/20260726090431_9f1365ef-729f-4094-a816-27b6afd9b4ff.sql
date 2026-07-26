CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  state text,
  district text,
  city text,
  type text,
  category text[],
  courses text[],
  fees_min integer,
  fees_max integer,
  entrance_exams text[],
  eligibility text,
  accreditation text,
  facilities text[],
  placement_high integer,
  placement_avg integer,
  hostel boolean DEFAULT false,
  website text,
  email text,
  phone text,
  description text,
  ranking integer,
  logo_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

GRANT SELECT ON public.colleges TO anon;
GRANT SELECT ON public.colleges TO authenticated;
GRANT ALL ON public.colleges TO service_role;

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Colleges are publicly readable" ON public.colleges FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  provider text,
  provider_type text,
  description text,
  level text[],
  category text[],
  gender text,
  income_limit text,
  state text,
  stream text[],
  course text[],
  amount text,
  application_start date,
  application_last date,
  documents text[],
  selection_process text,
  website text,
  apply_link text,
  faq jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

GRANT SELECT ON public.scholarships TO anon;
GRANT SELECT ON public.scholarships TO authenticated;
GRANT ALL ON public.scholarships TO service_role;

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scholarships are publicly readable" ON public.scholarships FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.saved_colleges ADD COLUMN IF NOT EXISTS college_slug text;
ALTER TABLE public.saved_scholarships ADD COLUMN IF NOT EXISTS scholarship_slug text;

CREATE INDEX idx_colleges_slug ON public.colleges(slug);
CREATE INDEX idx_colleges_state ON public.colleges(state);
CREATE INDEX idx_colleges_type ON public.colleges(type);
CREATE INDEX idx_colleges_category ON public.colleges USING GIN(category);
CREATE INDEX idx_colleges_courses ON public.colleges USING GIN(courses);

CREATE INDEX idx_scholarships_slug ON public.scholarships(slug);
CREATE INDEX idx_scholarships_state ON public.scholarships(state);
CREATE INDEX idx_scholarships_provider_type ON public.scholarships(provider_type);
CREATE INDEX idx_scholarships_category ON public.scholarships USING GIN(category);
CREATE INDEX idx_scholarships_level ON public.scholarships USING GIN(level);
CREATE INDEX idx_scholarships_course ON public.scholarships USING GIN(course);
CREATE INDEX idx_scholarships_dates ON public.scholarships(application_last);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON public.scholarships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();