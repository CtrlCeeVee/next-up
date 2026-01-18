import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { config } from "../../config";

const supabaseUrl = config.supabase.url || "https://placeholder.supabase.co";
const supabaseAnonKey = config.supabase.anonKey || "placeholder-key";

// Log to help debug environment variables
if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn("⚠️ Supabase configuration missing! Using placeholder values.");
  console.warn("Create a .env file with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY");
  console.warn("See ENV_SETUP.md for details.");
}

const options: SupabaseClientOptions<'public'> = {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
};

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, options);

// Also export as 'supabase' for compatibility
export const supabase = supabaseClient;
