CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, company_name, inn, is_b2b, legal_address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'inn', NULL),
    COALESCE((NEW.raw_user_meta_data->>'is_b2b')::boolean, false),
    COALESCE(NEW.raw_user_meta_data->>'legal_address', NULL)
  );
  RETURN NEW;
END;
$$;