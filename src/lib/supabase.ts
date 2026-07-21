import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qndffmktwtoezehbtnnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZGZmbWt0d3RvZXplaGJ0bm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzU0MjgsImV4cCI6MjA2MjgxMTQyOH0.gFAixD_8EIME94jXhBnKBeeeTtx4PKexBKZ_Ga2WKq4';

// Untyped client to avoid schema drift between DB and generated types.
export const supabase = createClient(supabaseUrl, supabaseKey);
