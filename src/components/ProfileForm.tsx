
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AvatarUploader } from "@/components/AvatarUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileFormProps {
  username: string;
}

interface ProfileData {
  full_name: string;
  bio: string;
  avatar_url: string;
  custom_title: string;
}

const ProfileForm = ({ username }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    full_name: "",
    bio: "",
    avatar_url: "",
    custom_title: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("You must be logged in");
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile");
          return;
        }

        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            bio: profile.bio || "",
            avatar_url: profile.avatar_url || "",
            custom_title: profile.custom_title || ""
          });
        }
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      avatar_url: url
    }));
  };

  const handleAvatarRemoved = () => {
    setFormData(prev => ({
      ...prev,
      avatar_url: ""
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in");
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          custom_title: formData.custom_title,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to save profile");
        return;
      }

      toast.success("Profile updated successfully");
      navigate(`/${username}`);
    } catch (error) {
      console.error("Error in save operation:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/${username}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const fallbackText = formData.full_name?.charAt(0) || username?.charAt(0) || "?";

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AvatarUploader
              currentAvatarUrl={formData.avatar_url}
              onAvatarUploaded={handleAvatarUploaded}
              onAvatarRemoved={handleAvatarRemoved}
              fallbackText={fallbackText}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom_title">Custom Page Title</Label>
                <Input
                  id="custom_title"
                  name="custom_title"
                  placeholder="Your Digital Identity"
                  value={formData.custom_title}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell people about yourself..."
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-4`}>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className={isMobile ? 'w-full' : ''}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={isMobile ? 'w-full' : ''}
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
