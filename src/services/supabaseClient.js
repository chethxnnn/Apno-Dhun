/**
 * Supabase Client for Apno Dhun
 * 
 * Initializes the Supabase client for Realtime Broadcast (Panchayat chat).
 * Uses ONLY the Realtime feature — zero database reads/writes.
 * 
 * Setup:
 *   1. Create free project at https://supabase.com
 *   2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env / Vercel env vars
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    : null;

export const isSupabaseConfigured = () => Boolean(supabase);
