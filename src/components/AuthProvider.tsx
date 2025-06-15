
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Clear any stale logout flags
        const explicitLogout = localStorage.getItem("explicitLogout");
        if (explicitLogout === "true") {
          localStorage.removeItem("explicitLogout");
          await supabase.auth.signOut();
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          await supabase.auth.signOut();
          if (mounted) {
            setSession(null);
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (currentSession) {
          // Validate session by getting user
          const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !currentUser) {
            console.error("User validation failed:", userError?.message);
            await supabase.auth.signOut();
            if (mounted) {
              setSession(null);
              setUser(null);
              setLoading(false);
            }
            return;
          }

          if (mounted) {
            setSession(currentSession);
            setUser(currentUser);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        console.log("Auth state changed:", event, newSession?.user?.id);

        if (event === 'SIGNED_OUT' || !newSession) {
          setSession(null);
          setUser(null);
        } else if (event === 'SIGNED_IN' && newSession) {
          setSession(newSession);
          setUser(newSession.user);
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          setSession(newSession);
          setUser(newSession.user);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      localStorage.setItem("explicitLogout", "true");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        localStorage.removeItem("explicitLogout");
        toast.error("Failed to sign out");
        return;
      }

      setSession(null);
      setUser(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("explicitLogout");
      toast.error("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Correctly implement useAuth as a context hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
