import { createClient } from "@supabase/supabase-js";

export const sbAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // RLS’yi by-pass eden key: yalnızca server
    { auth: { persistSession: false } }
  );
