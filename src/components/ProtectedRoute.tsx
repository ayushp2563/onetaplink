
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state until we check authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected content
  return <Outlet />;
}
