// Initialize Supabase client
const SUPABASE_URL = 'https://xyjyhwojxrqugnlbqmoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5anlod29qeHJxdWdubGJxbW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMDI3NTYsImV4cCI6MjA2MjU3ODc1Nn0.AxKNG5LS3zRLEpwBBdJFENnrP_Gu7bb3BZg-99aRl5I';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection
(async () => {
  const { data, error } = await supabase.from('credentials').select('*').limit(1);
  if (error) {
    console.error('❌ Supabase connection failed:', error.message);
  } else {
    console.log('✅ Supabase connected! Sample data:', data);
  }
})();