
import { useState } from "react";
import { Bell, ShieldAlert, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export function SOSButton() {
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  const handleSOS = () => {
    if (activated) {
      cancelSOS();
      return;
    }
    
    setActivated(true);
    toast({
      title: "SOS Activated",
      description: "Emergency contacts will be notified in 3 seconds. Tap again to cancel.",
      variant: "destructive",
    });
    
    // Start countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerEmergency();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Auto cancel after 10 seconds if not canceled manually
    setTimeout(() => {
      if (activated) {
        cancelSOS();
      }
    }, 10000);
  };
  
  const cancelSOS = () => {
    setActivated(false);
    setCountdown(3);
    toast({
      title: "SOS Canceled",
      description: "Emergency alert has been canceled.",
    });
  };
  
  const triggerEmergency = () => {
    // In a real app, this would send notifications to emergency contacts
    console.log("Emergency triggered");
    toast({
      title: "Emergency Contacts Notified",
      description: "Your location has been shared with your emergency contacts.",
      variant: "destructive",
    });
  };

  return (
    <button
      onClick={handleSOS}
      className={`sos-button w-16 h-16 ${
        activated ? "bg-destructive" : "bg-destructive/80"
      }`}
      aria-label="Emergency SOS Button"
    >
      {activated ? (
        <div className="flex flex-col items-center justify-center">
          <X className="w-6 h-6" />
          <span className="text-xs">{countdown}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
          <span className="text-xs">SOS</span>
        </div>
      )}
    </button>
  );
}
