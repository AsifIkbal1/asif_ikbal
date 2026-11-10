CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  whatsapp_number text NOT NULL CHECK (char_length(whatsapp_number) BETWEEN 5 AND 30),
  consultation_datetime timestamptz NOT NULL,
  additional_info text CHECK (additional_info IS NULL OR char_length(additional_info) <= 5000),
  pdf_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can upload order PDFs" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'order-pdfs' AND lower(storage.extension(name)) = 'pdf');