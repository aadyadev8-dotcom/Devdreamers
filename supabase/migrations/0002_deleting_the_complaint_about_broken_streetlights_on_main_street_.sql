DELETE FROM public.complaints
WHERE
  description = 'Several streetlights are out on Main Street near the city park, making the area unsafe at night.' AND
  status = 'Pending';