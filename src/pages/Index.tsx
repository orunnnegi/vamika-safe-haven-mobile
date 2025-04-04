
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately redirect to the splash screen
    navigate("/");
  }, [navigate]);
  
  return null;
};

export default Index;
