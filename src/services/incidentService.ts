
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  type: "harassment" | "suspicious" | "theft" | "other";
  user_id: string;
  user_name?: string;
}

// Get all incidents ordered by date (newest first)
export const getIncidents = async (): Promise<Incident[]> => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select(`
        *,
        profiles:user_id (name)
      `)
      .order('date', { ascending: false });
    
    if (handleSupabaseError(error)) {
      // Format the returned data to match our interface
      return (data || []).map((item: any) => ({
        ...item,
        user_name: item.profiles?.name || 'Anonymous'
      }));
    }
    
    return [];
  } catch (err) {
    console.error('Get incidents error:', err);
    toast({
      title: "Error loading incidents",
      description: err instanceof Error ? err.message : "Unknown error occurred",
      variant: "destructive",
    });
    return [];
  }
};

// Add a new incident
export const addIncident = async (incident: Omit<Incident, 'id' | 'user_id'>): Promise<boolean> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      toast({
        title: "Authentication error",
        description: "Please log in to report incidents",
        variant: "destructive",
      });
      return false;
    }
    
    const { error } = await supabase
      .from('incidents')
      .insert([{
        ...incident,
        user_id: session.user.id,
      }]);
    
    if (handleSupabaseError(error)) {
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep the community safe.",
      });
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Add incident error:', err);
    toast({
      title: "Error submitting report",
      description: err instanceof Error ? err.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};
