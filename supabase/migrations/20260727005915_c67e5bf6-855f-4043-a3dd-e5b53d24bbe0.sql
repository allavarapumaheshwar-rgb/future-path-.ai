CREATE TABLE public.roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  career_slug text,
  title text NOT NULL,
  source text NOT NULL DEFAULT 'curated',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_steps integer[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmaps TO authenticated;
GRANT ALL ON public.roadmaps TO service_role;

ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own roadmaps"
ON public.roadmaps
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX roadmaps_user_id_idx ON public.roadmaps (user_id);
CREATE UNIQUE INDEX roadmaps_user_career_idx ON public.roadmaps (user_id, career_slug) WHERE career_slug IS NOT NULL;

CREATE TRIGGER update_roadmaps_updated_at
BEFORE UPDATE ON public.roadmaps
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();