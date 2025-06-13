
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Shield } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface DashboardHeaderProps {
  username: string;
  fullName: string;
  avatarUrl: string;
  hasProfile: boolean;
}

export function DashboardHeader({ username, fullName, avatarUrl, hasProfile }: DashboardHeaderProps) {
  const { signOut } = useAuth();

  return (
    <div className="mb-8">
      {/* Website Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Personal Digital Identity Management System</h1>
            <p className="text-sm text-muted-foreground">Manage your digital presence</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={signOut}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-lg"></div>
        <CardHeader className="relative">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
              <AvatarImage
                src={avatarUrl || "/placeholder.svg"}
                alt={fullName || "Profile"}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold">
                {fullName?.charAt(0) || username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-2xl font-bold">
                {hasProfile ? `Welcome back, ${fullName || username}!` : 'Welcome to PDIMS!'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {hasProfile ? 'Manage your personalized profile page' : 'Create your personalized profile page'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
