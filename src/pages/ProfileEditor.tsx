import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link2, ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface Theme {
  id: string;
  name: string;
  background: string;
  description: string;
}

interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  theme: string;
}

interface FontStyle {
  id: string;
  name: string;
  class: string;
  description: string;
}

// Available themes
const THEMES: Theme[] = [
  {
    id: "elegant",
    name: "Elegant",
    background: "bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-950 dark:to-slate-950",
    description: "Refined purple gradient"
  },
  {
    id: "nature",
    name: "Nature",
    background: "bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-950 dark:to-slate-950",
    description: "Fresh green gradient"
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-slate-950",
    description: "Calming blue gradient"
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "bg-gradient-to-b from-orange-50 to-red-100 dark:from-orange-950 dark:to-slate-950",
    description: "Warm orange to red gradient"
  }
];

// Font style options
const FONT_STYLES: FontStyle[] = [
  {
    id: "sans",
    name: "Sans-Serif",
    class: "font-sans",
    description: "Clean and modern look"
  },
  {
    id: "serif",
    name: "Serif",
    class: "font-serif",
    description: "Elegant and traditional"
  },
  {
    id: "mono",
    name: "Monospace",
    class: "font-mono",
    description: "Technical and precise"
  },
  {
    id: "display",
    name: "Display",
    class: "font-display",
    description: "Bold and attention-grabbing"
  }
];

// Background image options
const BACKGROUND_IMAGES: BackgroundImage[] = [
  {
    id: "none",
    name: "None (Use Theme)",
    url: "",
    theme: "all"
  },
  {
    id: "abstract-purple",
    name: "Abstract Purple",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    theme: "elegant"
  },
  {
    id: "nature-green",
    name: "Forest Path",
    url: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    theme: "nature"
  },
  {
    id: "ocean-blue",
    name: "Ocean Wave",
    url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    theme: "ocean"
  },
  {
    id: "sunset-warm",
    name: "Sunset Glow",
    url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    theme: "sunset"
  },
  {
    id: "custom",
    name: "Custom URL",
    url: "",
    theme: "all"
  }
];

export default function ProfileEditor() {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState<Link[]>([]);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [themeId, setThemeId] = useState("elegant");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundImageId, setBackgroundImageId] = useState("none");
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState("");
  const [activeTab, setActiveTab] = useState("theme");
  const [fontStyle, setFontStyle] = useState("sans");
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
          description: error instanceof Error ? error.message : "Failed to load profile",
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
        .select('links, theme_id, is_dark_mode, background_style, font_style')
        .eq('id', session.user.id)
        .single();

      if (settings) {
        setThemeId(settings.theme_id || "elegant");
        setIsDarkMode(settings.is_dark_mode || false);
        setFontStyle(settings.font_style || "sans");
        
        if (settings.background_style) {
          try {
            const bgStyle = JSON.parse(settings.background_style);
            setBackgroundImageId(bgStyle.id || "none");
            if (bgStyle.id === "custom" && bgStyle.url) {
              setCustomBackgroundUrl(bgStyle.url);
            }
          } catch (e) {
            console.error("Failed to parse background style:", e);
          }
        }
        
        if (settings.links) {
          try {
            const linksData = settings.links as any[];
            if (Array.isArray(linksData)) {
              const validLinks = linksData.map(link => ({
                id: link.id || crypto.randomUUID(),
                title: link.title || "",
                url: link.url || "",
                icon: "link"
              }));
              setLinks(validLinks);
            }
          } catch (e) {
            console.error("Failed to parse links:", e);
          }
        }
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

  const getBackgroundStyle = () => {
    if (backgroundImageId === "none") {
      return null;
    }
    
    if (backgroundImageId === "custom") {
      return {
        id: "custom",
        url: customBackgroundUrl
      };
    }
    
    const selectedImage = BACKGROUND_IMAGES.find(img => img.id === backgroundImageId);
    return {
      id: selectedImage?.id,
      url: selectedImage?.url
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

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

      const backgroundStyle = getBackgroundStyle();
      
      const { error: settingsError } = await supabase
        .from('profile_settings')
        .update({ 
          links: links.map(({ icon, ...rest }) => rest),
          theme_id: themeId,
          is_dark_mode: isDarkMode,
          background_style: backgroundStyle ? JSON.stringify(backgroundStyle) : null,
          font_style: fontStyle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (settingsError) throw settingsError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBackgroundImages = BACKGROUND_IMAGES.filter(img => 
    img.theme === "all" || img.theme === themeId
  );

  useEffect(() => {
    document.documentElement.style.setProperty('--font-current', `var(--font-${fontStyle})`);
  }, [fontStyle]);

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
                  <h3 className="text-lg font-medium">Appearance</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="dark-mode" 
                      checked={isDarkMode} 
                      onCheckedChange={setIsDarkMode} 
                    />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="theme">Theme</TabsTrigger>
                      <TabsTrigger value="background">Background</TabsTrigger>
                      <TabsTrigger value="font">Font</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="theme">
                      <div className="space-y-2">
                        <Label>Select Theme</Label>
                        <RadioGroup 
                          value={themeId} 
                          onValueChange={setThemeId} 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                        >
                          {THEMES.map((theme) => (
                            <div key={theme.id} className="flex items-start space-x-2">
                              <RadioGroupItem value={theme.id} id={theme.id} />
                              <div className="grid gap-1.5">
                                <Label htmlFor={theme.id} className="font-medium">
                                  {theme.name}
                                </Label>
                                <div 
                                  className={`w-full h-12 rounded-md ${theme.background}`}
                                  aria-hidden="true"
                                />
                                <p className="text-sm text-muted-foreground">
                                  {theme.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="background">
                      <div className="space-y-2">
                        <Label>Select Background Image</Label>
                        <RadioGroup 
                          value={backgroundImageId} 
                          onValueChange={setBackgroundImageId} 
                          className="grid grid-cols-1 gap-4 mt-2"
                        >
                          {filteredBackgroundImages.map((image) => (
                            <div key={image.id} className="flex items-start space-x-2">
                              <RadioGroupItem value={image.id} id={`bg-${image.id}`} />
                              <div className="grid gap-1.5 w-full">
                                <Label htmlFor={`bg-${image.id}`} className="font-medium">
                                  {image.name}
                                </Label>
                                {image.id !== "none" && image.id !== "custom" && (
                                  <div 
                                    className="w-full h-24 rounded-md bg-cover bg-center"
                                    style={{ backgroundImage: `url(${image.url})` }}
                                    aria-hidden="true"
                                  />
                                )}
                                {image.id === "custom" && (
                                  <div className="mt-2">
                                    <Input
                                      placeholder="Enter image URL"
                                      value={customBackgroundUrl}
                                      onChange={(e) => setCustomBackgroundUrl(e.target.value)}
                                    />
                                    {customBackgroundUrl && (
                                      <div 
                                        className="w-full h-24 rounded-md bg-cover bg-center mt-2"
                                        style={{ backgroundImage: `url(${customBackgroundUrl})` }}
                                        aria-hidden="true"
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="font">
                      <div className="space-y-2">
                        <Label>Select Font Style</Label>
                        <RadioGroup 
                          value={fontStyle} 
                          onValueChange={setFontStyle} 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                        >
                          {FONT_STYLES.map((font) => (
                            <div key={font.id} className="flex items-start space-x-2">
                              <RadioGroupItem value={font.id} id={`font-${font.id}`} />
                              <div className="grid gap-1.5">
                                <Label
                                  htmlFor={`font-${font.id}`} 
                                  className={`font-medium ${font.class}`}
                                >
                                  {font.name}
                                </Label>
                                <p className={`text-sm text-muted-foreground ${font.class}`}>
                                  {font.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

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
