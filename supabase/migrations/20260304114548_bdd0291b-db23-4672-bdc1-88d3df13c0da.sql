
-- Create products storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Allow authenticated admins to upload to products bucket
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update product images
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
);

-- Allow admins to delete product images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  public.has_role(auth.uid(), 'admin')
);

-- Allow public read access to product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Create admin-readable profiles view for user management
CREATE OR REPLACE FUNCTION public.admin_get_profiles()
RETURNS SETOF public.profiles
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profiles
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY created_at DESC;
$$;
