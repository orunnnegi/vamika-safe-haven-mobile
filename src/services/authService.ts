
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
}

// Sign up a new user
export const signUp = async (credentials: SignUpCredentials): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (handleSupabaseError(error) && data.user) {
      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: credentials.name,
            email: credentials.email,
            phone: credentials.phone,
            created_at: new Date().toISOString(),
          }
        ]);

      handleSupabaseError(profileError);
      
      toast({
        title: "Account created!",
        description: "Welcome to Vamika",
      });
      
      return true;
    }

    return false;
  } catch (err) {
    console.error('Sign up error:', err);
    toast({
      title: "Sign up failed",
      description: err instanceof Error ? err.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Sign in an existing user
export const signIn = async (credentials: SignInCredentials): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (handleSupabaseError(error) && data.user) {
      toast({
        title: "Logged in successfully",
        description: "Welcome back to Vamika!",
      });
      return true;
    }

    return false;
  } catch (err) {
    console.error('Sign in error:', err);
    toast({
      title: "Login failed",
      description: err instanceof Error ? err.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Sign out the current user
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (handleSupabaseError(error)) {
      toast({
        title: "Logged out successfully",
      });
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Sign out error:', err);
    toast({
      title: "Error signing out",
      description: err instanceof Error ? err.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Get the currently authenticated user
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data as UserProfile;
  } catch (err) {
    console.error('Get current user error:', err);
    return null;
  }
};

// Update user profile
export const updateProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
      toast({
        title: "Authentication error",
        description: "Please log in again",
        variant: "destructive",
      });
      return false;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', session.user.id);
    
    if (handleSupabaseError(error)) {
      toast({
        title: "Profile updated",
        description: "Your information has been updated successfully",
      });
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Update profile error:', err);
    toast({
      title: "Error updating profile",
      description: err instanceof Error ? err.message : "Unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
};
