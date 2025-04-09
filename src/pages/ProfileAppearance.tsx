import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Palette, Layout, Type, Image, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LAYOUT_OPTIONS, LAYOUT_TYPES, LayoutType } from "@/constants/layouts";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { ProfileContent } from "@/components/layouts/ProfileContent";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import FaviconUploader from "@/components/FaviconUploader";

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

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display?: "title" | "icon" | "both";
}

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

const ANIMATION_OPTIONS = [
  { id: "fade", name: "Fade In", description: "Elements fade in smoothly" },
  { id: "slide", name: "Slide In", description: "Elements slide in from the side" },
  { id: "bounce", name: "Bounce", description: "Elements bounce into position" },
  { id: "none", name: "None", description: "No animation" }
];

export default function ProfileAppearance() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [themeId, setThemeId] = useState("elegant");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundImageId, setBackgroundImageId] = useState("none");
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState("");
  const [fontStyle, setFontStyle] = useState("sans");
  const [layoutType, setLayoutType] = useState<LayoutType>(LAYOUT_TYPES.LINKS);
  const [animationType, setAnimationType] = useState("fade");
  const [textShadow, setTextShadow] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [activeTab, setActiveTab] = useState("theme");
  const [previewMode, setPreviewMode] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
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
          setProfile(profile);
          setBio(profile.bio || "");
          setUsername(profile.username || "");
          setFullName(profile.full_name || "");
          setAvatarUrl(profile.avatar_url || "");
        }

        const { data: settings, error: settingsError } = await supabase
          .from('profile_settings')
          .select('links, theme_id, is_dark_mode, background_style, font_style, layout_type, animation_type, text_shadow, favicon_url')
          .eq('id', session.user.id)
          .single();

        if (settingsError) {
          console.error("Error loading settings:", settingsError);
          toast({
            title: "Error loading settings",
            description: "Using default appearance settings",
          });
        } else if (settings) {
          setThemeId(settings.theme_id || "elegant");
          setIsDarkMode(settings.is_dark_mode || false);
          setFontStyle(settings.font_style || "sans");
          setLayoutType((settings.layout_type as LayoutType) || LAYOUT_TYPES.LINKS);
          setAnimationType(settings.animation_type || "fade");
          setTextShadow(settings.text_shadow || false);
          setFaviconUrl(settings.favicon_url || null);
          
          setTheme(settings.is_dark_mode ? "dark" : "light");
          
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
              const linksData = settings.links as unknown as any[];
              if (Array.isArray(linksData)) {
                const validLinks = linksData.map(link => ({
                  id: link.id || crypto.randomUUID(),
                  title: link.title || "",
                  url: link.url || "",
                  icon: link.icon || "link",
                  display: link.display || "both"
                }));
                setLinks(validLinks);
              }
            } catch (e) {
              console.error("Failed to parse links:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate, toast, setTheme]);

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

  const handleFaviconUpload = (url: string) => {
    setFaviconUrl(url);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const backgroundStyle = getBackgroundStyle();
      
      const { error: settingsError } = await supabase
        .from('profile_settings')
        .update({ 
          theme_id: themeId,
          is_dark_mode: isDarkMode,
          background_style: backgroundStyle ? JSON.stringify(backgroundStyle) : null,
          font_style: fontStyle,
          layout_type: layoutType,
          animation_type: animationType,
          text_shadow: textShadow,
          favicon_url: faviconUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (settingsError) throw settingsError;

      toast({
        title: "Success",
        description: "Appearance settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  useEffect(() => {
    document.documentElement.style.setProperty('--font-current', `var(--font-${fontStyle})`);
  }, [fontStyle]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return () => {
      if (theme === "dark") {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  }, [isDarkMode, theme]);

  const filteredBackgroundImages = BACKGROUND_IMAGES.filter(img => 
    img.theme === "all" || img.theme === themeId
  );

  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  
  const hasBackgroundImage = backgroundImageId !== "none" && 
    ((backgroundImageId === "custom" && customBackgroundUrl) || 
     (backgroundImageId !== "custom"));
  
  const backgroundImageUrl = backgroundImageId === "custom" 
    ? customBackgroundUrl 
    : BACKGROUND_IMAGES.find(img => img.id === backgroundImageId)?.url || "";

  const textShadowClass = hasBackgroundImage && textShadow ? "text-shadow" : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant={previewMode ? "default" : "outline"}
              onClick={() => setPreviewMode(!previewMode)}
              className="flex-1 sm:flex-none"
            >
              {previewMode ? "Exit Preview" : "Preview"}
            </Button>
            <ThemeToggle className="flex-none" />
          </div>
        </div>

        {previewMode ? (
          <div className="mb-4 p-4">
            <div 
              className={`min-h-[80vh] rounded-lg overflow-hidden ${!hasBackgroundImage ? selectedTheme.background : ''}`}
              style={hasBackgroundImage ? {
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
            >
              <div className={`min-h-[80vh] ${hasBackgroundImage ? 'bg-black/40 backdrop-blur-sm' : ''} p-6`}>
                <div className="container max-w-2xl mx-auto">
                  <div className="text-center mb-12">
                    <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-white/20 overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                          {fullName?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <h1 className={`text-2xl font-bold mb-2 text-white ${textShadowClass}`}>{fullName || "Your Name"}</h1>
                    <p className={`text-white/80 mb-4 ${textShadowClass}`}>@{username || "username"}</p>
                    {bio && (
                      <p className={`text-white/90 max-w-md mx-auto mb-8 ${textShadowClass}`}>{bio}</p>
                    )}
                  </div>
                  
                  <ProfileContent 
                    layoutType={layoutType}
                    links={links.length > 0 ? links : [
                      { id: "1", title: "Example Link", url: "#", icon: "link" },
                      { id: "2", title: "Another Link", url: "#", icon: "github" },
                      { id: "3", title: "Social Media", url: "#", icon: "instagram" }
                    ]}
                    textShadowClass={textShadowClass}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4 w-full">
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Save These Settings"}
              </Button>
            </div>
          </div>
        ) : (
          <Card className="mb-4 overflow-hidden">
            <CardHeader className="px-6">
              <CardTitle className="text-2xl">Customize Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-4 mb-6">
                  <TabsTrigger value="theme" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">Theme</span>
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    <span className="hidden sm:inline">Layout</span>
                  </TabsTrigger>
                  <TabsTrigger value="background" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span className="hidden sm:inline">Background</span>
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span className="hidden sm:inline">Typography</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="theme">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="dark-mode" 
                          checked={isDarkMode} 
                          onCheckedChange={setIsDarkMode} 
                        />
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <ThemeToggle variant="outline" className="ml-2" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label className="text-lg">Color Theme</Label>
                      <p className="text-muted-foreground text-sm mb-4">
                        Choose a color theme for your profile page
                      </p>
                      
                      <RadioGroup 
                        value={themeId} 
                        onValueChange={setThemeId} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {THEMES.map((theme) => (
                          <div key={theme.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={theme.id} id={theme.id} />
                            <div className="grid gap-1.5 flex-1">
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
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label className="text-lg">Favicon</Label>
                      <p className="text-muted-foreground text-sm mb-4">
                        Upload a custom favicon for your profile page
                      </p>
                      
                      {profile && profile.id && (
                        <FaviconUploader 
                          userId={profile.id}
                          currentFavicon={faviconUrl}
                          onFaviconUpload={handleFaviconUpload}
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="layout">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-lg">Layout Style</Label>
                      <p className="text-muted-foreground text-sm mb-4">
                        Choose how your links are displayed on your profile
                      </p>
                      
                      <RadioGroup 
                        value={layoutType} 
                        onValueChange={(value) => {
                          if (value === LAYOUT_TYPES.LINKS || 
                              value === LAYOUT_TYPES.BENTO || 
                              value === LAYOUT_TYPES.MIXED) {
                            setLayoutType(value);
                          }
                        }} 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        {LAYOUT_OPTIONS.map((layout) => (
                          <div key={layout.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={layout.id} id={`layout-${layout.id}`} />
                            <div className="grid gap-1.5 flex-1">
                              <Label htmlFor={`layout-${layout.id}`}>
                                <div className="flex items-center gap-2">
                                  <span>{layout.name}</span>
                                </div>
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {layout.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label className="text-lg">Animation</Label>
                      <p className="text-muted-foreground text-sm mb-4">
                        Choose how elements appear on your profile page
                      </p>
                      
                      <RadioGroup 
                        value={animationType} 
                        onValueChange={setAnimationType} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {ANIMATION_OPTIONS.map((animation) => (
                          <div key={animation.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={animation.id} id={`animation-${animation.id}`} />
                            <div className="grid gap-1.5 flex-1">
                              <Label htmlFor={`animation-${animation.id}`}>
                                {animation.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {animation.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="background">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-lg">Background Image</Label>
                      <p className="text-muted-foreground text-sm mb-4">
                        Choose a background image for your profile or use the theme color
                      </p>
                      
                      <RadioGroup 
                        value={backgroundImageId} 
                        onValueChange={setBackgroundImageId} 
                        className="grid grid-cols-1 gap-4"
                      >
                        {filteredBackgroundImages.map((image) => (
                          <div key={image.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={image.id} id={`bg-${image.id}`} />
                            <div className="grid gap-1.5 flex-1">
                              <Label htmlFor={`bg-${image.id}`}>
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
                                <div className="mt-2 w-full">
                                  <Input
                                    placeholder="Enter image URL"
                                    value={customBackgroundUrl}
                                    onChange={(e) => setCustomBackgroundUrl(e.target.value)}
                                    className="w-full"
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
                    
                    <Separator />
                    
                    <div className="flex items-center gap-2 justify-between">
                      <div>
                        <Label htmlFor="text-shadow" className="block mb-1">Text Shadow</Label>
                        <p className="text-sm text-muted-foreground">
                          Add shadow to text for better readability on images
                        </p>
                      </div>
                      <Switch 
                        id="text-shadow" 
                        checked={textShadow} 
                        onCheckedChange={setTextShadow}
                        disabled={backgroundImageId === "none"} 
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="typography">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-lg">Font Style</Label>
                      <p className="text-muted-foreground text-sm mb-4">
                        Choose a font style for your profile
                      </p>
                      
                      <RadioGroup 
                        value={fontStyle} 
                        onValueChange={setFontStyle} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {FONT_STYLES.map((font) => (
                          <div key={font.id} className="flex items-start space-x-2">
                            <RadioGroupItem value={font.id} id={`font-${font.id}`} />
                            <div className="grid gap-1.5 flex-1">
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
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/edit-profile")}
                  className="w-full sm:w-auto"
                >
                  Edit Profile Content
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
