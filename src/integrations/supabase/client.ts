import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mwlleadwnnvcfuiwxint.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bGxlYWR3bm52Y2Z1aXd4aW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTQzODMsImV4cCI6MjA1NzczMDM4M30.hfyVg7SCKaHVCI4pnFkvlkviVV2Z8VZUQ202E01S5ns";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);