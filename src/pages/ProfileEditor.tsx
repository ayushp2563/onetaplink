import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link2, ArrowLeft, Upload } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export default function ProfileEditor() {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        setBio(profile.bio || "");
        setUsername(profile.username || "");
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      const { data: settings } = await supabase
        .from('profile_settings')
        .select('links')
        .eq('id', session.user.id)
        .single();

      if (settings?.links) {
        setLinks((settings.links as any[]).map(link => ({
          ...link,
          icon: "link"
        })));
      }
    };

    loadProfile();
  }, [navigate, toast]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleAddLink = () => {
    setLinks([...links, { id: crypto.randomUUID(), title: "", url: "", icon: "link" }]);
  };

  const handleLinkChange = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Check username uniqueness using count instead of single()
      if (username) {
        const { count, error: checkError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('username', username)
          .neq('id', session.user.id);

        if (checkError) throw checkError;
        if (count && count > 0) {
          throw new Error("Username already taken");
        }
      }

      // Upload avatar if changed
      let avatar_url = avatarUrl;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const filePath = `${session.user.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatar, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        avatar_url = publicUrl;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          username,
          full_name: fullName,
          bio,
          avatar_url: avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Update links
      const { error: linksError } = await supabase
        .from('profile_settings')
        .update({ 
          links: links.map(({ icon, ...rest }) => rest)
        })
        .eq('id', session.user.id);

      if (linksError) throw linksError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      navigate(`/${username}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{fullName?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be your profile URL: profilee.app/{username}
                  </p>
                </div>

                <Input
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Textarea
                  placeholder="Write a short bio about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px]"
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Links</h3>
                    <Button type="button" variant="outline" onClick={handleAddLink}>
                      Add Link
                    </Button>
                  </div>

                  {links.map((link) => (
                    <div key={link.id} className="flex gap-2">
                      <Input
                        placeholder="Title"
                        value={link.title}
                        onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="URL"
                        value={link.url}
                        onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveLink(link.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
