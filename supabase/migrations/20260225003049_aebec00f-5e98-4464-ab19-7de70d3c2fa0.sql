
ALTER TABLE public.businesses
  ADD COLUMN registration_status text DEFAULT NULL,
  ADD COLUMN sells_online text DEFAULT NULL,
  ADD COLUMN offers_delivery text DEFAULT NULL,
  ADD COLUMN email text DEFAULT NULL,
  ADD COLUMN website text DEFAULT NULL;
