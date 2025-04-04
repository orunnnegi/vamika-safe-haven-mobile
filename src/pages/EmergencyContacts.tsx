
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, PhoneCall, Plus, Shield, Trash2, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relation: ""
  });
  
  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem("vamika-auth-token");
    
    if (!authToken) {
      navigate("/auth");
      return;
    }
    
    // Load saved contacts from localStorage
    const savedContacts = localStorage.getItem("vamika-contacts");
    
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (error) {
        console.error("Failed to parse contacts:", error);
      }
    } else {
      // Example data
      const exampleContacts: Contact[] = [
        {
          id: "1",
          name: "Mom",
          phone: "+1 (555) 123-4567",
          relation: "Family"
        },
        {
          id: "2",
          name: "Sarah (Roommate)",
          phone: "+1 (555) 987-6543",
          relation: "Friend"
        }
      ];
      
      setContacts(exampleContacts);
      localStorage.setItem("vamika-contacts", JSON.stringify(exampleContacts));
    }
  }, [navigate]);
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing information",
        description: "Please provide both name and phone number.",
        variant: "destructive",
      });
      return;
    }
    
    const newContactWithId: Contact = {
      ...newContact,
      id: Date.now().toString()
    };
    
    const updatedContacts = [...contacts, newContactWithId];
    setContacts(updatedContacts);
    localStorage.setItem("vamika-contacts", JSON.stringify(updatedContacts));
    
    // Reset form
    setNewContact({
      name: "",
      phone: "",
      relation: ""
    });
    
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your emergency contacts.`
    });
  };
  
  const handleDeleteContact = (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    setContacts(updatedContacts);
    localStorage.setItem("vamika-contacts", JSON.stringify(updatedContacts));
    
    toast({
      title: "Contact removed",
      description: "The emergency contact has been removed."
    });
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
            <h1 className="text-xl font-bold">Emergency Contacts</h1>
          </div>
        </div>
      </header>
      
      <main className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Trusted Contacts</h2>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                <span>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="Contact name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="relation">Relationship</Label>
                  <Input
                    id="relation"
                    value={newContact.relation}
                    onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                    placeholder="Family, Friend, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddContact}>Add Contact</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="card-highlight p-4">
          <p className="text-sm text-muted-foreground mb-4">
            These contacts will be notified in case of an emergency when you use the SOS feature.
          </p>
          
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No emergency contacts added yet</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {/* Same content as above dialog */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Relation</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.relation}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-vamika-blue">
                          <PhoneCall className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default EmergencyContacts;
