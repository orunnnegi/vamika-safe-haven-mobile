
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const authenticated = await isAuthenticated();
        navigate(authenticated ? "/dashboard" : "/");
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
