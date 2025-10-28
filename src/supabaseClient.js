import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pmdvdunlkphexfpyxwny.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZHZkdW5sa3BoZXhmcHl4d255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzQ4MDQsImV4cCI6MjA3NzE1MDgwNH0.vyyAHVy0IdpvJ9U3k4Zc-fmjuwXlIpbkV-zEQhs0UAE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
