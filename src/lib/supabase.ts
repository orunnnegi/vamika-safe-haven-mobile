
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Import the configured Supabase client
import { supabase as configuredSupabase } from '@/integrations/supabase/client';

// Re-export the configured client
export const supabase = configuredSupabase;

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
