import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== "undefined") {
      console.warn("Supabase keys are missing. Check your .env file.");
    }
    // Return a dummy client to prevent crash during development
    return createBrowserClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseKey || "placeholder-key"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
