import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isInvalid = !supabaseUrl || !supabaseAnonKey || supabaseUrl.startsWith("your_") || supabaseAnonKey.startsWith("your_");

if (isInvalid) {
  console.warn("NexaSight AI: Supabase keys are missing or invalid. Please configure your .env file.");
}

// Initialize only if keys are present and not placeholders
export const supabase = createClient(
  isInvalid ? "https://placeholder-url.supabase.co" : supabaseUrl, 
  isInvalid ? "placeholder-key" : supabaseAnonKey
);
