/**
 * Supabase Client for Apno Dhun
 * 
 * Initializes the Supabase client for Realtime Broadcast (Panchayat chat).
 * Uses ONLY the Realtime feature — zero database reads/writes.
 */

import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Normalize URL: if user provided just project ID, format to https://<id>.supabase.co
let normalizedUrl = rawUrl;
if (normalizedUrl && !normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
  normalizedUrl = `https://${normalizedUrl}.supabase.co`;
}

let client = null;

if (normalizedUrl && rawKey) {
  try {
    client = createClient(normalizedUrl, rawKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Supabase client initialization caught error:', err);
    client = null;
  }
}

export const supabase = client;
export const isSupabaseConfigured = () => Boolean(supabase);
