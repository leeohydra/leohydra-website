import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

console.log("SUPABASE_URL EXISTS:", !!process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY EXISTS:", !!process.env.SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
