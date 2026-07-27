CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  requested_role text;
  safe_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, email, mobile, grade, stream, interests)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'mobile',
    NEW.raw_user_meta_data->>'grade',
    NEW.raw_user_meta_data->>'stream',
    CASE WHEN NEW.raw_user_meta_data ? 'interests'
         THEN ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'interests'))
         ELSE NULL END
  );

  -- Only allow non-privileged, self-service roles from client-supplied metadata.
  requested_role := NEW.raw_user_meta_data->>'role';
  IF requested_role IN ('student', 'parent', 'teacher') THEN
    safe_role := requested_role::public.app_role;
  ELSE
    safe_role := 'student'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, safe_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;