
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

type ProfileFormProps = {
  username: string;
};

type ProfileData = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

const ProfileForm = ({ username }: ProfileFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
  });
  const isMobile = useIsMobile();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, bio, avatar_url')
          .eq('username', username)
          .single();
          
        if (error) {
          toast.error("Error fetching profile");
          console.error("Error fetching profile:", error);
          return;
        }
        
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast.error("Could not load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
        
      if (error) {
        toast.error("Failed to update profile");
        console.error("Update error:", error);
        return;
      }
      
      toast.success("Profile updated successfully");
      // Navigate to dashboard instead of profile page
      navigate("/dashboard");
    } catch (error) {
      console.error("Error in profile update:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Display Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your display name"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              placeholder="A short bio about yourself"
              rows={4}
              className="w-full"
            />
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} space-y-2 md:space-y-0 md:space-x-2 mt-6`}>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/appearance")}
              className={`${isMobile ? 'w-full' : ''} mb-2 md:mb-0`}
            >
              Customize Appearance
            </Button>
            <div className={`flex ${isMobile ? 'w-full' : ''} space-x-2`}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                className={isMobile ? 'flex-1' : ''}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className={isMobile ? 'flex-1' : ''}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
