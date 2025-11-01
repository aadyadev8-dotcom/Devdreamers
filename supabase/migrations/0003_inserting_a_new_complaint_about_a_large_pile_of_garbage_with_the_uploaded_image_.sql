INSERT INTO public.complaints (
  category,
  description,
  image_url,
  latitude,
  longitude,
  status,
  title,
  user_id
) VALUES (
  'Garbage',
  'Large pile of garbage accumulating on an empty plot in Dhantoli, requiring immediate cleanup.',
  '/dump.jpg', -- Using the public URL of the uploaded image
  34.0522, -- Placeholder Latitude (e.g., Los Angeles)
  -118.2437, -- Placeholder Longitude (e.g., Los Angeles)
  'Pending',
  'Garbage Pile in Dhantoli',
  auth.uid() -- Automatically links to the currently authenticated user, or NULL if no user is logged in
);