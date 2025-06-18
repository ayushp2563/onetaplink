
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Link as LinkIcon,
  Settings,
  LogOut,
  User,
  Palette,
  Shield,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { session, user, signOut } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isUserProfilePage = location.pathname.match(/^\/[a-zA-Z0-9_-]+$/);
  
  // Don't show navbar on landing, how to use, and auth pages
  const hideNavbarPaths = ['/', '/how-to-use', '/auth'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);
  

  // Fetch username when session changes
  React.useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        
        setUsername(profile?.username || null);
      } else {
        setUsername(null);
      }
    };

    fetchUsername();
  }, [session]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const closeNav = () => setIsNavOpen(false);
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
  ];

  const authNavItems = [
    { name: 'Profile', path: `/edit-profile/${username}`, icon: <User className="w-5 h-5" /> },
    { name: 'Appearance', path: '/appearance', icon: <Palette className="w-5 h-5" /> },
    { name: 'Edit Links', path: '/edit-links', icon: <LinkIcon className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl hidden lg:inline-block">PDIMS</span>
              <span className="font-bold text-sm inline-block lg:hidden">PDIMS</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {session && username && authNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {!session || !username ? (
              <Button size="sm" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={signOut}
                  className="hidden md:flex gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>{username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={toggleNav} className="md:hidden">
              {isNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {isNavOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden animate-fade-in">
          <nav className="container flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeNav}
                className={`flex items-center gap-3 rounded-md py-2 px-3 text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            {session && username && (
              <>
                <div className="h-px bg-border my-2"></div>
                {authNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeNav}
                    className={`flex items-center gap-3 rounded-md py-2 px-3 text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="h-px bg-border my-2"></div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    closeNav();
                  }}
                  className="flex justify-start gap-3 rounded-md py-2 px-3 text-sm font-medium text-foreground hover:bg-accent transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
