
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        
        // Set up auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
          setIsAuthenticated(!!session);
        });
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        toast.error("Authentication error. Please try logging in again.");
      }
    };
    
    checkAuth();
  }, []);
  
  // Show loading state until we check authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast.error("You must be logged in to access this page", {
      id: "auth-required",
      duration: 3000
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected content
  return <Outlet />;
}
