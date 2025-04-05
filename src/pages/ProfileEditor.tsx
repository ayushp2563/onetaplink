
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { LAYOUT_TYPES } from "@/constants/layouts";
import { useToast } from "@/hooks/use-toast";
import FaviconUploader from "@/components/FaviconUploader";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  custom_title?: string;
}

interface ProfileSettings {
  id: string;
  links: any[];
  theme_id: string;
  is_dark_mode: boolean;
  font_style: string;
  layout_type: string;
  text_shadow: boolean;
  background_style?: string;
  favicon_url?: string;
}

export default function ProfileEditor() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const { toast: showToast } = useToast();

  // Form state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [links, setLinks] = useState([
    { title: "", url: "", icon: "Link" },
  ]);

  // Query to fetch user data
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: async () => {
      // Get user id from username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Get profile settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("profile_settings")
        .select("*")
        .eq("id", profileData.id)
        .single();

      return {
        profile: profileData as Profile,
        settings: settingsError ? null : (settingsData as ProfileSettings),
      };
    },
  });

  useEffect(() => {
    if (data) {
      const { profile, settings } = data;
      
      // Set form values from profile
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setCustomTitle(profile.custom_title || "");
      
      // Set favicon URL if available
      if (settings?.favicon_url) {
        setFaviconUrl(settings.favicon_url);
      }
      
      // Set links from settings if available
      if (settings?.links) {
        try {
          const parsedLinks = typeof settings.links === 'string' 
            ? JSON.parse(settings.links) 
            : settings.links;
          setLinks(parsedLinks);
        } catch (e) {
          console.error("Failed to parse links:", e);
          setLinks([{ title: "", url: "", icon: "Link" }]);
        }
      }
    }
  }, [data]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!data?.profile?.id) {
        throw new Error("User ID not found");
      }

      // Update the profile data
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio,
          custom_title: customTitle,
        })
        .eq("id", data.profile.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      // Update favicon URL in settings
      if (data.settings) {
        const { error: settingsUpdateError } = await supabase
          .from("profile_settings")
          .update({
            favicon_url: faviconUrl,
            links: links,
          })
          .eq("id", data.profile.id);

        if (settingsUpdateError) {
          throw settingsUpdateError;
        }
      }

      toast.success("Profile updated successfully!");
      navigate(`/u/${username}`);
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-500">{(error as Error).message}</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <TabsContent value="profile">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metadata">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="customTitle">Custom Page Title</Label>
                  <Input
                    id="customTitle"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="My Awesome Profile - John Doe"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This title will be shown in the browser tab when someone visits your profile.
                  </p>
                </div>

                <div>
                  <Label htmlFor="favicon">Custom Favicon</Label>
                  <div className="mt-2">
                    <FaviconUploader 
                      userId={data?.profile?.id || ""}
                      currentFavicon={faviconUrl}
                      onFaviconUpload={setFaviconUrl}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="links">
              <div className="space-y-4">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Label htmlFor={`link-title-${index}`}>Link Title</Label>
                      <Input
                        id={`link-title-${index}`}
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = [...links];
                          newLinks[index].title = e.target.value;
                          setLinks(newLinks);
                        }}
                        placeholder="GitHub"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`link-url-${index}`}>URL</Label>
                      <Input
                        id={`link-url-${index}`}
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...links];
                          newLinks[index].url = e.target.value;
                          setLinks(newLinks);
                        }}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div className="mt-8">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                          const newLinks = links.filter((_, i) => i !== index);
                          setLinks(newLinks.length ? newLinks : [{ title: "", url: "", icon: "Link" }]);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLinks([...links, { title: "", url: "", icon: "Link" }]);
                  }}
                >
                  Add Link
                </Button>
              </div>
            </TabsContent>

            <div className="mt-6 flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/u/${username}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Tabs>
    </div>
  );
}
