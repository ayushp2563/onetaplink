
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProfileEditor from "./pages/ProfileEditor";
import UserProfile from "./pages/UserProfile";
import Landing from "./pages/Landing";
import HowToUse from "./pages/HowToUse";
import ProfileAppearance from "./pages/ProfileAppearance";
import LinkEditorPage from "./pages/LinkEditorPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="oneTapLink-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/edit-profile/:username" element={<ProfileEditor />} />
            <Route path="/appearance" element={<ProfileAppearance />} />
            <Route path="/edit-links" element={<LinkEditorPage />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/:username" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
