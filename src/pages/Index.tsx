
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: JSX.Element;
}

interface Theme {
  id: string;
  name: string;
  background: string;
  class: string;
}

const THEMES: Theme[] = [
  {
    id: "elegant",
    name: "Elegant",
    background: "bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-950 dark:to-slate-950",
    class: "theme-elegant",
  },
  {
    id: "nature",
    name: "Nature",
    background: "bg-gradient-to-b from-green-50 to-emerald-100 dark:from-green-950 dark:to-slate-950",
    class: "theme-nature",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "bg-gradient-to-b from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-slate-950",
    class: "theme-ocean",
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "bg-gradient-to-b from-orange-50 to-red-100 dark:from-orange-950 dark:to-slate-950",
    class: "theme-sunset",
  },
];

const Index = () => {
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [isDark, setIsDark] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [fontStyle, setFontStyle] = useState("sans");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      const fetchProfileData = async () => {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            if (profileError.code === 'PGRST116') {
              setHasProfile(false);
              return;
            }
          }

          if (profile?.username) {
            setUsername(profile.username);
            setHasProfile(true);
          } else {
            setHasProfile(false);
            return;
          }

          const { data: settings, error: settingsError } = await supabase
            .from('profile_settings')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (settingsError) {
            console.error('Error fetching profile settings:', settingsError);
            return;
          }

          if (settings) {
            setTheme(THEMES.find(t => t.id === settings.theme_id) || THEMES[0]);
            setIsDark(settings.is_dark_mode);
            setFontStyle(settings.font_style || 'sans');
          }
        } catch (error) {
          console.error('Error in fetchProfileData:', error);
        }
      };

      fetchProfileData();
    }
  }, [session, navigate]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.className = theme.class;
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-current', `var(--font-${fontStyle})`);

    return () => {
      document.documentElement.style.removeProperty('--font-current');
    };
  }, [fontStyle]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.background}`}>
      <div className="container max-w-2xl px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" />
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="relative w-full h-full rounded-full object-cover border-2 border-white/50"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {session ? session.user.user_metadata.full_name || 'Your Profile' : 'Welcome to Profilee'}
          </h1>
          <p className="text-muted-foreground">
            {hasProfile ? 'Your personalized profile page' : 'Create your personalized profile page'}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/edit-profile')} 
              className="w-full sm:w-auto"
            >
              {hasProfile ? 'Edit Profile' : 'Create Profile'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut} 
              className="w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {session && username && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center p-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg"
          >
            <h2 className="text-lg font-medium mb-4">Your Public Profile</h2>
            <p className="mb-4 text-muted-foreground">
              Share your profile or view how it looks to others:
            </p>
            <Button 
              variant="default" 
              onClick={() => window.open(`/${username}`, '_blank')} 
              className="w-full sm:w-auto"
            >
              View Public Profile
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
