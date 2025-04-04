
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Error handling helper
export const handleSupabaseError = (error: Error | null) => {
  if (error) {
    console.error('Supabase error:', error);
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

// Check if a user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
};
