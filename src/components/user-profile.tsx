
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "./theme-toggle";

interface UserProfileProps {
  name: string | null | undefined;
  email: string | null | undefined;
  phone: string | null | undefined;
  avatar?: string | null;
}

export function UserProfile({ name, email, phone, avatar }: UserProfileProps) {
  // Add fallback for when name is null or undefined
  const displayName = name || "User";
  
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="card-highlight">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Profile</CardTitle>
        <ThemeToggle />
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        <Avatar className="h-24 w-24 mb-4">
          {avatar && <AvatarImage src={avatar} alt={displayName} />}
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-2xl font-bold">{displayName}</h2>
        
        <div className="w-full mt-4 space-y-2">
          <div className="flex items-center p-2 rounded-md bg-muted">
            <span className="text-muted-foreground mr-2">Email:</span>
            <span className="font-medium">{email || "Not provided"}</span>
          </div>
          
          <div className="flex items-center p-2 rounded-md bg-muted">
            <span className="text-muted-foreground mr-2">Phone:</span>
            <span className="font-medium">{phone || "Not provided"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
