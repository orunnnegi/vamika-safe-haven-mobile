
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Bell, Shield } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SOSButton } from "@/components/sos-button";
import { UserProfile } from "@/components/user-profile";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface User {
  name: string;
  email: string;
  phone: string;
}

interface SafetyAlert {
  id: string;
  area: string;
  level: "high" | "medium" | "low";
  message: string;
  time: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const safetyAlerts: SafetyAlert[] = [
    {
      id: "1",
      area: "Downtown",
      level: "medium",
      message: "Increased reports of street harassment in this area",
      time: "2 hours ago"
    },
    {
      id: "2",
      area: "Central Park",
      level: "low",
      message: "Low visibility in evening hours, stay on lit paths",
      time: "Yesterday"
    }
  ];
  
  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem("vamika-auth-token");
    const userData = localStorage.getItem("vamika-user");
    
    if (!authToken || !userData) {
      navigate("/auth");
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Failed to parse user data:", error);
      navigate("/auth");
    }
    
    setLoading(false);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("vamika-auth-token");
    localStorage.removeItem("vamika-user");
    toast({
      title: "Logged out successfully",
    });
    navigate("/auth");
  };
  
  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="vamika-gradient text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">Vamika</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="text-white border-white hover:bg-white/20">
          Logout
        </Button>
      </header>
      
      <main className="p-4 space-y-6">
        <UserProfile
          name={user.name}
          email={user.email}
          phone={user.phone}
        />
        
        <div className="flex justify-center my-8">
          <SOSButton />
        </div>
        
        <Card className="card-highlight">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Safety Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {safetyAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-md bg-muted">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  alert.level === "high" ? "text-destructive" : 
                  alert.level === "medium" ? "text-vamika-orange" : 
                  "text-vamika-blue"
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{alert.area}</h4>
                    <Badge variant={
                      alert.level === "high" ? "destructive" : 
                      alert.level === "medium" ? "outline" : 
                      "secondary"
                    }>
                      {alert.level} risk
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/safe-spots")}>
              View Safety Map <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
