import { Link2, Share2, ChevronRight, Moon, Sun, Github, Linkedin, Twitter, Mail, LogOut } from "lucide-react";
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

const DEMO_LINKS: Link[] = [
  {
    id: "1",
    title: "My Personal Website",
    url: "https://example.com",
    icon: <Link2 className="w-5 h-5" />,
  },
  {
    id: "2",
    title: "GitHub Profile",
    url: "https://github.com",
    icon: <Github className="w-5 h-5" />,
  },
  {
    id: "3",
    title: "LinkedIn",
    url: "https://linkedin.com",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    id: "4",
    title: "Twitter",
    url: "https://twitter.com",
    icon: <Twitter className="w-5 h-5" />,
  },
  {
    id: "5",
    title: "Email Me",
    url: "mailto:example@email.com",
    icon: <Mail className="w-5 h-5" />,
  },
];

const Index = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [isDark, setIsDark] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
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
              setShowDemo(true);
              setHasProfile(false);
              setLinks(DEMO_LINKS);
              return;
            }
          }

          if (profile?.username) {
            setUsername(profile.username);
            setHasProfile(true);
            setShowDemo(false);
          } else {
            setShowDemo(true);
            setHasProfile(false);
            setLinks(DEMO_LINKS);
            return;
          }

          const { data: settings, error: settingsError } = await supabase
            .from('profile_settings')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (settingsError) {
            console.error('Error fetching profile settings:', settingsError);
            setLinks(DEMO_LINKS);
            return;
          }

          if (settings) {
            setTheme(THEMES.find(t => t.id === settings.theme_id) || THEMES[0]);
            setIsDark(settings.is_dark_mode);
            setFontStyle(settings.font_style || 'sans');
            
            const linksArray = Array.isArray(settings.links) ? settings.links : [];
            const fetchedLinks = linksArray.map((link: any) => ({
              id: link.id,
              title: link.title,
              url: link.url,
              icon: <Link2 className="w-5 h-5" />
            }));
            setLinks(fetchedLinks.length > 0 ? fetchedLinks : DEMO_LINKS);
          }
        } catch (error) {
          console.error('Error in fetchProfileData:', error);
          setLinks(DEMO_LINKS);
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

  const handleShareProfile = async () => {
    if (!username || typeof username !== "string" || username.trim() === "") {
      toast({
        title: "Error",
        description: "Username not found. Please set up your profile first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const sanitizedUsername = encodeURIComponent(username.trim());
      const profileUrl = `${window.location.origin}/${sanitizedUsername}`;

      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied!",
        description: "Your profile link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <select
              value={theme.id}
              onChange={(e) => setTheme(THEMES.find((t) => t.id === e.target.value) || THEMES[0])}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-1 text-sm"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          
          {session ? (
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/edit-profile')}>
                {hasProfile ? 'Edit Profile' : 'Create Profile'}
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="text-muted-foreground">
              Sign In
            </Button>
          )}
        </div>

        {showDemo && (
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h2 className="text-lg font-medium mb-2">Welcome to Your Dashboard!</h2>
            <p className="text-muted-foreground mb-3">
              This is a demo view. Create your profile to personalize your page and share it with others.
            </p>
            <Button onClick={() => navigate('/edit-profile')} variant="default">
              Create Your Profile
            </Button>
          </div>
        )}

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
            {session ? session.user.user_metadata.full_name || (showDemo ? 'Demo Profile' : 'Your Name') : 'Welcome to Profilee'}
          </h1>
          <p className="text-muted-foreground">
            {session ? (showDemo ? 'Sample Profile Page' : 'Digital Creator & Developer') : 'Create your personalized profile page'}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {links.map((link) => (
            <motion.div key={link.id} variants={item}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card glass-card block p-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-primary">{link.icon}</span>
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <button 
              onClick={handleShareProfile}
              className="inline-flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Profile</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
