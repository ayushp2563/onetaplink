
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Copy, Link2, PenSquare, LayoutPanelTop, ExternalLink, ArrowUpRight, Palette, User } from "lucide-react";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { useAuth } from "@/components/AuthProvider";
import { DashboardHeader } from "@/components/DashboardHeader";

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

const DashboardPage = () => {
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [linkCount, setLinkCount] = useState(0);
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  const { session, user } = useAuth();
  
  usePageMetadata({ title: "Dashboard" });

  useEffect(() => {
    if (!session || !user) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url, bio')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          if (profileError.code === 'PGRST116') {
            setHasProfile(false);
          }
          return;
        }

        if (profile?.username) {
          setUsername(profile.username);
          setFullName(profile.full_name || '');
          setAvatarUrl(profile.avatar_url || '');
          setBio(profile.bio || '');
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }

        // Fetch profile settings
        const { data: settings, error: settingsError } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('id', user.id)
          .single();

        if (settingsError) {
          console.error('Error fetching profile settings:', settingsError);
        } else if (settings) {
          setTheme(THEMES.find(t => t.id === settings.theme_id) || THEMES[0]);
          
          // Count links
          if (settings.links && Array.isArray(settings.links)) {
            setLinkCount(settings.links.length);
          }
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, user, navigate]);

  const handleShareProfile = () => {
    if (username) {
      const profileUrl = `${window.location.origin}/${username}`;
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard");
    } else {
      toast.error("No username found. Please create a profile first.");
    }
  };

  const handleEditProfile = () => {
    if (hasProfile) {
      navigate(`/edit-profile/${username}`);
    } else {
      navigate(`/edit-profile/${username || 'new'}`);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-6">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DashboardHeader 
            username={username}
            fullName={fullName}
            avatarUrl={avatarUrl}
            hasProfile={hasProfile}
          />
        </motion.div>

        {hasProfile ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-1"
            >
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center text-primary mb-1">
                    <User className="w-5 h-5 mr-2" />
                    <CardTitle className="text-lg">Edit Profile</CardTitle>
                  </div>
                  <CardDescription>
                    Update your name, bio, and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <span className="ml-2 text-muted-foreground">
                        {fullName || "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Bio:</span>
                      <span className="ml-2 text-muted-foreground">
                        {bio ? (bio.length > 30 ? `${bio.substring(0, 30)}...` : bio) : "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Avatar:</span>
                      <span className="ml-2 text-muted-foreground">
                        {avatarUrl ? "Uploaded" : "Not set"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={handleEditProfile}
                    className="w-full gap-2"
                  >
                    <PenSquare className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="col-span-1"
            >
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center text-primary mb-1">
                    <Share2 className="w-5 h-5 mr-2" />
                    <CardTitle className="text-lg">Share Your Profile</CardTitle>
                  </div>
                  <CardDescription>
                    Let others discover your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
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
                    variant="default" 
                    onClick={() => window.open(`/${username}`, '_blank')}
                    className="w-full gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Open Your Profile
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1"
            >
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center text-primary mb-1">
                    <Link2 className="w-5 h-5 mr-2" />
                    <CardTitle className="text-lg">Manage Links</CardTitle>
                  </div>
                  <CardDescription>
                    Add, edit, or remove links from your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mb-2 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-primary font-medium">
                      {linkCount}
                    </span>
                    <span>
                      {linkCount === 0 
                        ? "No links added yet" 
                        : linkCount === 1 
                          ? "Link added to your profile" 
                          : "Links added to your profile"
                      }
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => navigate('/edit-links')}
                    className="w-full gap-2"
                  >
                    <PenSquare className="w-4 h-4" />
                    Edit Links
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-1"
            >
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center text-primary mb-1">
                    <LayoutPanelTop className="w-5 h-5 mr-2" />
                    <CardTitle className="text-lg">Appearance</CardTitle>
                  </div>
                  <CardDescription>
                    Customize the look and feel of your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose themes, colors, and layout options to match your style.
                  </p>
                  <div className="flex gap-2 mt-3">
                    {THEMES.map((t) => (
                      <div 
                        key={t.id}
                        className={`w-6 h-6 rounded-full cursor-pointer border ${
                          theme.id === t.id ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                        } ${t.id === 'elegant' ? 'bg-purple-500' : 
                            t.id === 'nature' ? 'bg-green-500' : 
                            t.id === 'ocean' ? 'bg-blue-500' : 
                            'bg-orange-500'}`}
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    onClick={() => navigate('/appearance')}
                    className="w-full gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    Customize Appearance
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-dashed p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <UserIcon className="w-8 h-8 text-primary/70" />
              </div>
              <CardTitle className="text-xl mb-2">Create Your Profile</CardTitle>
              <CardDescription className="mb-6">
                You haven't set up your profile yet. Create one to start sharing your links with the world.
              </CardDescription>
              <Button onClick={handleEditProfile}>Get Started</Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Icon component
const UserIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default DashboardPage;
