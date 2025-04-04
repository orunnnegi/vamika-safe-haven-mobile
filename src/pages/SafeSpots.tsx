
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Compass, MapPin, Search, Shield, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SafeSpot {
  id: string;
  name: string;
  type: "police" | "hospital" | "shelter" | "safe-business";
  rating: number;
  distance: string;
  address: string;
  openNow: boolean;
}

const SafeSpots = () => {
  const navigate = useNavigate();
  const [safeSpots, setSafeSpots] = useState<SafeSpot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem("vamika-auth-token");
    
    if (!authToken) {
      navigate("/auth");
      return;
    }
    
    // Simulate API call for safe spots
    setTimeout(() => {
      const mockSafeSpots: SafeSpot[] = [
        {
          id: "1",
          name: "Central Police Station",
          type: "police",
          rating: 4.5,
          distance: "0.8 miles",
          address: "123 Safety Ave, Downtown",
          openNow: true
        },
        {
          id: "2",
          name: "City General Hospital",
          type: "hospital",
          rating: 4.8,
          distance: "1.2 miles",
          address: "456 Health Blvd, Midtown",
          openNow: true
        },
        {
          id: "3",
          name: "Women's Shelter",
          type: "shelter",
          rating: 4.7,
          distance: "1.5 miles",
          address: "789 Support St, Eastside",
          openNow: true
        },
        {
          id: "4",
          name: "SafeCafe Coffee Shop",
          type: "safe-business",
          rating: 4.2,
          distance: "0.3 miles",
          address: "101 Main St, Downtown",
          openNow: true
        },
        {
          id: "5",
          name: "Riverside Police Department",
          type: "police",
          rating: 4.4,
          distance: "2.1 miles",
          address: "202 River Road, Westside",
          openNow: true
        }
      ];
      
      setSafeSpots(mockSafeSpots);
      setLoading(false);
    }, 1000);
  }, [navigate]);
  
  const filteredSpots = safeSpots.filter(spot => 
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    spot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getBadgeForType = (type: SafeSpot["type"]) => {
    switch (type) {
      case "police":
        return <Badge className="bg-vamika-blue">Police</Badge>;
      case "hospital":
        return <Badge className="bg-vamika-purple">Hospital</Badge>;
      case "shelter":
        return <Badge className="bg-vamika-pink">Shelter</Badge>;
      case "safe-business":
        return <Badge variant="outline">Safe Business</Badge>;
      default:
        return <Badge variant="secondary">Other</Badge>;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="vamika-gradient text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="mr-2 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            <h1 className="text-xl font-bold">Safe Spots</h1>
          </div>
        </div>
      </header>
      
      <main className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for safe locations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <p className="text-sm">
            This map would show nearby safe locations with live navigation. For this demo, we're showing a list view.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading safe spots...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSpots.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No safe spots match your search</p>
              </div>
            ) : (
              filteredSpots.map((spot) => (
                <Card key={spot.id} className="card-highlight">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{spot.name}</CardTitle>
                      {getBadgeForType(spot.type)}
                    </div>
                    <CardDescription>{spot.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-vamika-orange fill-vamika-orange mr-1" />
                        <span>{spot.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800">
                          {spot.openNow ? "Open Now" : "Closed"}
                        </Badge>
                        <Badge variant="secondary">
                          <Compass className="w-3 h-3 mr-1" />
                          {spot.distance}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default SafeSpots;
