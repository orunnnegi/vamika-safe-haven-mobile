
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        navigate(session ? "/dashboard" : "/");
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/");
      }
    };
    
    checkAuthAndRedirect();
  }, [navigate]);
  
  return null;
};

export default Index;
