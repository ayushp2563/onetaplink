
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Shield, Key, User, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  
  usePageMetadata({ title: "Account Settings" });
  
  // Fetch user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        setUser(session.user);
        setEmail(session.user.email || "");

        // Fetch username from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load account information");
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserData();
  }, [navigate]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!username || username.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters long");
      return;
    }

    // Basic username validation
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setErrorMessage("Username can only contain letters, numbers, underscores, and hyphens");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Check if username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .neq('id', user.id)
        .single();
      
      if (existingProfile) {
        setErrorMessage("Username is already taken");
        return;
      }

      // Update username in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Username updated successfully");
      
    } catch (error: any) {
      console.error("Error updating username:", error);
      setErrorMessage(error.message || "Failed to update username");
      toast.error("Failed to update username");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // First verify current password is correct
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      // Change password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      console.error("Error updating password:", error);
      setErrorMessage(error.message || "Failed to update password");
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email || email === user?.email) {
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast.success("Verification email sent to your new email address");
      
    } catch (error: any) {
      console.error("Error updating email:", error);
      setErrorMessage(error.message || "Failed to update email");
      toast.error("Failed to update email");
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="flex items-center mb-8">
        <Shield className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Username</CardTitle>
              <CardDescription>
                Update your username. This will change your profile URL.
              </CardDescription>
            </CardHeader>
            
            {errorMessage && (
              <div className="px-6 -mt-2">
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            )}
            
            <CardContent>
              <form id="username-form" onSubmit={handleUsernameUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your-username"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your profile will be available at: /{username || 'your-username'}
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="username-form" 
                disabled={isUpdating || !username}
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Username
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Update your email address. A verification email will be sent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="email-form" onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="email-form" 
                disabled={isUpdating || email === user?.email}
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Email
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate(`/edit-profile/${username}`)} 
                className="flex items-center gap-2"
                disabled={!username}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password. You'll need to know your current password.
              </CardDescription>
            </CardHeader>
            
            {errorMessage && (
              <div className="px-6 -mt-2">
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            )}
            
            <CardContent>
              <form id="password-form" onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="password-form" 
                disabled={isUpdating || !currentPassword || !newPassword || !confirmPassword}
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
