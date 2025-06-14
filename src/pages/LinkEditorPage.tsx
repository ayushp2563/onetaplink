
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LinkEditor from "@/components/LinkEditor";
import { toast } from "sonner";
import { usePageMetadata } from "@/hooks/usePageMetadata";

export default function LinkEditorPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  
  usePageMetadata({ title: "Edit Links" });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("You must be logged in to edit links");
          navigate("/auth");
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
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will navigate away in useEffect
  }

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container max-w-2xl mx-auto">
        <div className="flex justify-start mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Your Links</h1>
          <p className="text-muted-foreground">Add, edit, or remove links that will appear on your profile</p>
        </div>
        
        <LinkEditor />
      </div>
    </div>
  );
}
