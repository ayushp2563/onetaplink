import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { ProfileContent } from "@/components/layouts/ProfileContent";
import { LAYOUT_TYPES, LayoutType } from "@/constants/layouts";

interface Profile {
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  id: string;
}

interface ProfileSettings {
  links: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  theme_id: string;
  is_dark_mode: boolean;
  font_style?: string;
  layout_type?: LayoutType;
  background_style?: {
    id: string;
    url: string;
  } | null;
}

interface Theme {
  id: string;
  background: string;
}

const THEMES: { [key: string]: Theme } = {
  elegant: {
    id: "elegant",
    background: "bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-950 dark:to-slate-950",
  },
  nature: {
    id: "nature",
    background: "bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-950 dark:to-slate-950",
  },
  ocean: {
    id: "ocean",
    background: "bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-slate-950",
  },
  sunset: {
    id: "sunset",
    background: "bg-gradient-to-b from-orange-50 to-red-100 dark:from-orange-950 dark:to-slate-950",
  },
};

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!username) {
          console.error("No username provided in URL");
          setError("Username is required");
          navigate('/404');
          return;
        }

        console.log("Fetching profile for username:", username);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        console.log("Profile fetch result:", { profile, profileError });

        if (profileError) {
          console.error("Profile error:", profileError);
          setError("Failed to load profile");
          toast({
            title: "Error",
            description: "Failed to load profile: " + (profileError instanceof Error ? profileError.message : "Unknown error"),
            variant: "destructive",
          });
          return;
        }

        if (!profile) {
          console.log("No profile found for username:", username);
          setError("Profile not found");
          toast({
            title: "Not Found",
            description: "This profile does not exist",
            variant: "destructive",
          });
          return;
        }

        setProfile(profile);

        const { data: settings, error: settingsError } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('id', profile.id)
          .maybeSingle();

        console.log("Settings fetch result:", { settings, settingsError });

        if (settingsError) {
          console.error("Settings error:", settingsError);
          setError("Error loading profile settings");
          toast({
            title: "Error",
            description: "Failed to load profile settings",
            variant: "destructive",
          });
          return;
        }

        if (!settings) {
          console.error("No settings found for profile:", profile.id);
          setError("Profile settings not found");
          return;
        }
        
        const typedSettings: ProfileSettings = {
          links: (settings.links || []) as ProfileSettings['links'],
          theme_id: settings.theme_id || 'elegant',
          is_dark_mode: settings.is_dark_mode || false,
          font_style: settings.font_style || 'sans',
          layout_type: (settings.layout_type as LayoutType) || LAYOUT_TYPES.LINKS
        };

        if (settings.background_style) {
          try {
            typedSettings.background_style = JSON.parse(settings.background_style);
          } catch (e) {
            console.error("Failed to parse background style:", e);
          }
        }

        setSettings(typedSettings);

        if (settings.is_dark_mode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        document.documentElement.style.setProperty('--font-current', `var(--font-${typedSettings.font_style || 'sans'})`);
      } catch (error: unknown) {
        console.error('Error loading profile:', error);
        setError((error as Error).message);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    return () => {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.removeProperty('--font-current');
    };
  }, [username, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "This profile does not exist"}</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const theme = THEMES[settings?.theme_id || 'elegant'] || THEMES.elegant;
  
  const hasBackgroundImage = settings.background_style && settings.background_style.id !== "none" && settings.background_style.url;
  
  const backgroundStyle = hasBackgroundImage
    ? { 
        backgroundImage: `url(${settings.background_style?.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  const textShadowClass = hasBackgroundImage ? "text-shadow" : "";

  return (
    <div 
      className={`min-h-screen ${!hasBackgroundImage ? theme.background : ''}`}
      style={backgroundStyle}
    >
      <div className={`min-h-screen ${hasBackgroundImage ? 'bg-black/40 backdrop-blur-sm' : ''}`}>
        <div className="container max-w-2xl px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="relative w-40 h-40 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse opacity-80" />
              <Avatar className="w-full h-full border-4 border-white/50 dark:border-black/20 shadow-lg">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold">{profile.full_name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
            </div>
            <h1 className={`text-2xl font-bold mb-2 text-white ${textShadowClass}`}>{profile.full_name}</h1>
            <p className={`text-white/80 mb-4 ${textShadowClass}`}>@{profile.username}</p>
            {profile.bio && (
              <p className={`text-white/90 max-w-md mx-auto mb-8 ${textShadowClass}`}>{profile.bio}</p>
            )}
          </motion.div>

          <ProfileContent 
            layoutType={settings?.layout_type || LAYOUT_TYPES.LINKS}
            links={settings?.links || []}
            textShadowClass={textShadowClass}
          />
        </div>
      </div>
    </div>
  );
}
