
import { LogOut, Share2, Copy, Link2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleShareProfile = () => {
    if (username) {
      const profileUrl = `${window.location.origin}/${username}`;
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied!",
        description: "Share your profile link with others.",
      });
    } else {
      toast({
        title: "No username found",
        description: "Please create a profile first.",
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
      {/* Logo and Header */}
      <header className="w-full py-4 px-6 flex justify-center items-center">
        <div className="flex items-center">
          <Link2 className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            One Tap Link
          </h1>
        </div>
      </header>

      <div className="container max-w-4xl px-4 py-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-none shadow-xl bg-white/5 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-400 rounded-full animate-pulse opacity-80" />
                <Avatar className="w-full h-full border-4 border-white/50 dark:border-black/20 shadow-lg">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl font-bold">
                    {session?.user?.user_metadata?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-bold">
                {session ? session.user.user_metadata.full_name || 'Your Profile' : 'Welcome to One Tap Link'}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {hasProfile ? 'Your personalized profile page' : 'Create your personalized profile page'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                <Button 
                  onClick={() => navigate('/edit-profile')} 
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                >
                  {hasProfile ? 'Edit Profile' : 'Create Profile'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="w-full sm:w-auto border-primary/20 hover:bg-primary/5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {session && username && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2"
          >
            <Card className="overflow-hidden border-none shadow-lg glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center text-primary mb-1">
                  <Share2 className="w-5 h-5 mr-2" />
                  <CardTitle className="text-lg">Share Your Profile</CardTitle>
                </div>
                <CardDescription>
                  Let others discover your links and content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-between bg-white/10 dark:bg-black/20 p-2 rounded-md">
                  <code className="text-sm truncate">
                    {`${window.location.origin}/${username}`}
                  </code>
                  <Button size="sm" variant="ghost" onClick={handleShareProfile} className="ml-2 flex-shrink-0">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="secondary" 
                  onClick={() => window.open(`/${username}`, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Public Profile
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center text-primary mb-1">
                  <Link2 className="w-5 h-5 mr-2" />
                  <CardTitle className="text-lg">Manage Your Links</CardTitle>
                </div>
                <CardDescription>
                  Add, edit, or remove links from your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Customize your profile with links to your social media, websites, and more.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  onClick={() => navigate('/edit-profile')}
                  className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                >
                  Customize Profile
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
