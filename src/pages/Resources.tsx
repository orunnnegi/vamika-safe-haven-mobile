
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ExternalLink, Phone, Shield } from "lucide-react";

interface HelplineResource {
  id: string;
  name: string;
  phone: string;
  description: string;
  hours: string;
}

interface GuideResource {
  id: string;
  title: string;
  summary: string;
  link?: string;
  content?: string;
}

const Resources = () => {
  const navigate = useNavigate();
  const [helplines, setHelplines] = useState<HelplineResource[]>([]);
  const [guides, setGuides] = useState<GuideResource[]>([]);
  
  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem("vamika-auth-token");
    
    if (!authToken) {
      navigate("/auth");
      return;
    }
    
    // Mock helpline data
    const mockHelplines: HelplineResource[] = [
      {
        id: "1",
        name: "National Women's Helpline",
        phone: "1-800-799-7233",
        description: "24/7 crisis intervention, safety planning, and referral service for women experiencing domestic violence.",
        hours: "24/7"
      },
      {
        id: "2",
        name: "Crisis Text Line",
        phone: "Text HOME to 741741",
        description: "Free 24/7 support for people in crisis via text message.",
        hours: "24/7"
      },
      {
        id: "3",
        name: "Sexual Assault Hotline",
        phone: "1-800-656-4673",
        description: "Confidential support for survivors of sexual assault and their loved ones.",
        hours: "24/7"
      },
      {
        id: "4",
        name: "Local Police Department",
        phone: "911",
        description: "For immediate emergency assistance.",
        hours: "24/7"
      }
    ];
    
    // Mock guides data
    const mockGuides: GuideResource[] = [
      {
        id: "1",
        title: "Personal Safety Tips",
        summary: "Essential safety practices for everyday situations.",
        content: "• Be aware of your surroundings at all times\n• Keep your phone charged and accessible\n• Share your location with trusted contacts when traveling\n• Trust your instincts\n• Stay in well-lit areas when possible\n• Consider taking a self-defense class"
      },
      {
        id: "2",
        title: "How to Use the SOS Feature",
        summary: "Quick guide for using Vamika's emergency features.",
        content: "1. Tap the SOS button on the main dashboard\n2. You'll have 3 seconds to cancel before your contacts are alerted\n3. Your emergency contacts will receive your location\n4. The app will continue to update your location until you mark yourself as safe"
      },
      {
        id: "3",
        title: "Creating a Safety Plan",
        summary: "Steps to create your personalized safety strategy.",
        content: "A safety plan includes:\n• Emergency contacts list\n• Safe locations in your area\n• Essential items to keep accessible\n• Memorized phone numbers\n• Planned escape routes\n• Code words to use with trusted friends"
      }
    ];
    
    setHelplines(mockHelplines);
    setGuides(mockGuides);
  }, [navigate]);
  
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
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
            <h1 className="text-xl font-bold">Resources</h1>
          </div>
        </div>
      </header>
      
      <main className="p-4">
        <Tabs defaultValue="helplines">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="helplines">Helplines</TabsTrigger>
            <TabsTrigger value="guides">Safety Guides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="helplines" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              These helplines are available for emergency support and advice.
            </p>
            
            {helplines.map((helpline) => (
              <Card key={helpline.id} className="card-highlight">
                <CardHeader className="pb-2">
                  <CardTitle>{helpline.name}</CardTitle>
                  <CardDescription>{helpline.hours} availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{helpline.description}</p>
                  <Button
                    onClick={() => handleCall(helpline.phone)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{helpline.phone}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="guides" className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Educational resources to help you stay safe.
            </p>
            
            {guides.map((guide) => (
              <Card key={guide.id} className="card-highlight">
                <CardHeader className="pb-2">
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  {guide.content && (
                    <div className="text-sm whitespace-pre-line">
                      {guide.content}
                    </div>
                  )}
                  
                  {guide.link && (
                    <Button variant="outline" className="mt-4 w-full flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Read Full Guide</span>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Resources;
