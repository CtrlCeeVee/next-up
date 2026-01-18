import { Config, ConfigMode } from "./config.interface";

/**
 * Application configuration
 * 
 * Environment variables must be prefixed with EXPO_PUBLIC_ to be accessible
 * in the app code. Example: EXPO_PUBLIC_SUPABASE_URL
 * 
 * Create a .env file in the root of native-app/ directory:
 * 
 * EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 * EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 * EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
 */

export const config: Config = {
  mode: __DEV__ ? ConfigMode.DEVELOPMENT : ConfigMode.PRODUCTION,
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3001",
  },
  expo: {
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID || "",
  },
};
