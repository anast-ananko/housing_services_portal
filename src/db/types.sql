DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
      CREATE TYPE request_status AS ENUM ('pending','in_progress','completed','cancelled');
   END IF;
END
$$;

DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
      CREATE TYPE payment_method AS ENUM ('card','cash','online');
   END IF;
END
$$;

DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
      CREATE TYPE payment_status AS ENUM ('paid','pending','failed');
   END IF;
END
$$;

DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'manager_role') THEN
      CREATE TYPE manager_role AS ENUM ('admin','technician','support');
   END IF;
END
$$;
