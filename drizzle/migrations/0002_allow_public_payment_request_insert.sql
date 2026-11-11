GRANT INSERT ON public.payment_requests TO anon, authenticated;
CREATE POLICY "Public can submit payment requests"
ON public.payment_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);