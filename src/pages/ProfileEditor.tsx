
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ProfileForm from "../components/ProfileForm";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useIsMobile } from "@/hooks/use-mobile";

const ProfileEditor = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const isMobile = useIsMobile();

  usePageMetadata({ title: `Edit Profile - ${username || ''}` });

  // If no username, show message immediately and abort other logic
  if (!username) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center md:text-left">Edit Profile</h1>
        <p className="text-center">No username provided.</p>
      </div>
    );
  }

  // Check authentication and authorization
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          toast.error("You must be logged in to edit profiles");
          navigate("/auth");
          return;
        }

        // Get current user's profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();

        // Check if the authenticated user is trying to edit their own profile
        if (userProfile?.username !== username) {
          toast.error("You can only edit your own profile");
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking authorization:", error);
        toast.error("Access denied");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [username, navigate]);

  // Show loading state or authorized content
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Component will navigate away in useEffect, this prevents flash of unauthorized content
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center md:text-left">Edit Profile</h1>
      <ProfileForm username={username} />
    </div>
  );
};

export default ProfileEditor;

