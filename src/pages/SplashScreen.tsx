
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem("vamika-auth-token");
    
    // Set timer for splash screen
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      setTimeout(() => {
        // Navigate to auth screen or dashboard if logged in
        navigate(authToken ? "/dashboard" : "/auth");
      }, 500); // Wait for fade out animation
    }, 4500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-vamika-purple/90 to-vamika-blue/90 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-fade-in flex flex-col items-center">
        <Shield className="w-24 h-24 text-white mb-6" />
        <h1 className="text-4xl font-bold text-white mb-2">Vamika</h1>
        <p className="text-lg text-white/80">Safety in your hands</p>
      </div>
    </div>
  );
};

export default SplashScreen;
