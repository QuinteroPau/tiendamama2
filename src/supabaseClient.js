import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujcwtuhsecxqczzleocq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
