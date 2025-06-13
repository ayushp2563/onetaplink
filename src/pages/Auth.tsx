import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, AlertCircle, Mail, Key, User, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Always check for a valid session first
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session fetch error:", error.message);
          // Clear any stale session data
          await supabase.auth.signOut();
          localStorage.removeItem("explicitLogout");
          return;
        }
  
        if (session) {
          // Validate the session by checking if the user still exists
          try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
              console.error("User validation failed:", userError?.message);
              // Session is invalid, clear it
              await supabase.auth.signOut();
              localStorage.removeItem("explicitLogout");
              return;
            }
            
            // Session is valid, navigate to dashboard
            localStorage.removeItem("explicitLogout");
            navigate('/dashboard');
          } catch (validationError) {
            console.error("Session validation error:", validationError);
            // Clear invalid session
            await supabase.auth.signOut();
            localStorage.removeItem("explicitLogout");
          }
        } else {
          // No session exists, clear the logout flag
          localStorage.removeItem("explicitLogout");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear everything on error
        await supabase.auth.signOut();
        localStorage.removeItem("explicitLogout");
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Clear explicit logout flag on successful sign in
          localStorage.removeItem("explicitLogout");
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          // Only redirect to auth if it was an explicit logout
          const explicitLogout = localStorage.getItem("explicitLogout");
          if (explicitLogout === "true") {
            navigate('/auth');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (!email || !password || !username || !fullName) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        throw new Error("Username can only contain letters, numbers, underscores and hyphens");
      }

      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error("Error checking username availability");
      }

      if (existingUser) {
        throw new Error("Username already taken. Please choose a different username.");
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (signUpData.user && !signUpData.session) {
        toast.success("Account created! Please check your email for confirmation.");
        return;
      }

      if (signUpData.session) {
        // Clear explicit logout flag on successful signup
        localStorage.removeItem("explicitLogout");
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }

    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred during signup";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        }

        if (error.message.toLowerCase().includes("email not confirmed")) {
          try {
            await supabase.auth.resend({
              type: 'signup',
              email,
            });
            throw new Error("Your email is not confirmed. We've sent a new confirmation link to your email.");
          } catch {
            throw new Error("Your email is not confirmed. Please check your email for the confirmation link.");
          }
        }

        throw error;
      }

      if (data.session) {
        // Clear explicit logout flag on successful sign in
        localStorage.removeItem("explicitLogout");
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        throw new Error("Sign in failed - no session created");
      }

    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Invalid email or password";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      const errorMsg = "Please enter your email address";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Password reset email sent. Check your inbox.");
      setErrorMessage("");
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : "Failed to send reset email";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/30">
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md shadow-card-hover animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-16 h-16 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Personal Digital Identity</CardTitle>
          <CardDescription>
            Sign in to your identity management system or create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert className="mb-6 bg-destructive/5 text-destructive border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="px-0 font-normal text-xs"
                      onClick={handlePasswordReset}
                      disabled={loading}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signup-username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-fullname">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="Your Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing up..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4 text-center text-sm text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}