
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, FileText, MapPin, Plus, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getIncidents, addIncident, Incident } from "@/services/incidentService";
import { isAuthenticated } from "@/lib/supabase";

const IncidentReports = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    location: "",
    type: "harassment" as Incident["type"]
  });
  
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        navigate("/auth");
        return;
      }
      
      // Load incidents from Supabase
      loadIncidents();
    };
    
    checkAuth();
  }, [navigate]);
  
  const loadIncidents = async () => {
    setLoading(true);
    const incidentData = await getIncidents();
    setIncidents(incidentData);
    setLoading(false);
  };
  
  const handleAddIncident = async () => {
    if (!newIncident.title || !newIncident.location) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and location.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await addIncident({
      ...newIncident,
      date: new Date().toISOString()
    });
    
    if (success) {
      // Reset form
      setNewIncident({
        title: "",
        description: "",
        location: "",
        type: "harassment"
      });
      
      // Reload incidents
      await loadIncidents();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getTypeBadge = (type: Incident["type"]) => {
    switch (type) {
      case "harassment":
        return <Badge variant="destructive">Harassment</Badge>;
      case "suspicious":
        return <Badge variant="outline" className="bg-vamika-orange/10 text-vamika-orange border-vamika-orange/20">Suspicious</Badge>;
      case "theft":
        return <Badge variant="outline" className="bg-vamika-blue/10 text-vamika-blue border-vamika-blue/20">Theft</Badge>;
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
            <h1 className="text-xl font-bold">Incident Reports</h1>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/20">
              <Plus className="w-4 h-4 mr-1" />
              Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                  placeholder="Brief description of the incident"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newIncident.type}
                  onChange={(e) => setNewIncident({
                    ...newIncident, 
                    type: e.target.value as Incident["type"]
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="harassment">Harassment</option>
                  <option value="suspicious">Suspicious Activity</option>
                  <option value="theft">Theft</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                  placeholder="Where did this happen?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  placeholder="Provide details about what happened"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddIncident}>Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      
      <main className="p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-12 card-highlight">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No incident reports yet</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                {/* Same content as above dialog */}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="card-highlight">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{incident.title}</CardTitle>
                    {getTypeBadge(incident.type)}
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {incident.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{incident.description || "No additional details provided."}</p>
                  {incident.user_name && (
                    <p className="text-xs text-muted-foreground mt-2">Reported by: {incident.user_name}</p>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Reported on {formatDate(incident.date)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default IncidentReports;
