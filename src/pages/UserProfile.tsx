
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

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
          setError("Username is required");
          navigate('/404');
          return;
        }

        console.log("Fetching profile for username:", username);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          setError("Profile not found");
          navigate('/404');
          return;
        }

        if (!profile) {
          setError("Profile not found");
          navigate('/404');
          return;
        }

        console.log("Profile found:", profile);
        setProfile(profile);

        const { data: settings, error: settingsError } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('id', profile.id)
          .single();

        if (settingsError) {
          console.error("Settings error:", settingsError);
          setError("Error loading profile settings");
          return;
        }

        console.log("Settings found:", settings);
        
        const typedSettings: ProfileSettings = {
          ...settings,
          links: (settings.links || []) as ProfileSettings['links']
        };
        setSettings(typedSettings);

        // Apply theme
        if (settings.is_dark_mode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Cleanup function to reset theme when leaving the profile page
    return () => {
      document.documentElement.classList.remove('dark');
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

  const theme = THEMES[settings.theme_id] || THEMES.elegant;

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <div className="container max-w-2xl px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>{profile.full_name?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-2">{profile.full_name}</h1>
          <p className="text-muted-foreground mb-4">@{profile.username}</p>
          {profile.bio && (
            <p className="text-muted-foreground max-w-md mx-auto">{profile.bio}</p>
          )}
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {settings.links?.map((link) => (
            <motion.div
              key={link.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
