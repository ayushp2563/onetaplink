
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link2, ChevronRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

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
    icon?: string;
  }>;
  theme_id: string;
  is_dark_mode: boolean;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profile);

        const { data: settings, error: settingsError } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('id', profile.id)
          .single();

        if (settingsError) throw settingsError;
        setSettings(settings);
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile || !settings) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container max-w-2xl px-4 py-8 mx-auto">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

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
