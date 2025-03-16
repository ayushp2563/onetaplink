
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ArrowUp, Edit, Grid, Link, PanelLeft, PanelTop, Settings, Share2 } from "lucide-react";

const HowToUse = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 pb-20">
      <div className="container max-w-4xl px-4 py-12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Button>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            How to Use Our Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-center text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            Follow these simple steps to create and share your perfect profile page
          </motion.p>
        </div>
        
        {/* Step-by-step guide */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Step 1 */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <PanelLeft className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center mb-2">
                <span className="bg-primary/20 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2 text-sm font-bold">1</span>
                Sign Up for an Account
              </h2>
              <p className="text-muted-foreground mb-4">
                Create your account with a few simple details. It only takes a minute to get started.
              </p>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Navigate to the sign-up page and enter your email
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Create a secure password
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Choose your unique username
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <Edit className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center mb-2">
                <span className="bg-primary/20 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2 text-sm font-bold">2</span>
                Customize Your Profile
              </h2>
              <p className="text-muted-foreground mb-4">
                Personalize your profile with your information, photo, and design preferences.
              </p>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Add your profile photo and bio
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Choose a theme that matches your style
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Adjust colors, fonts, and background
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <Link className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center mb-2">
                <span className="bg-primary/20 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2 text-sm font-bold">3</span>
                Add Your Links
              </h2>
              <p className="text-muted-foreground mb-4">
                Add all the important links you want to share with your audience.
              </p>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Add social media profiles, websites, portfolios
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Customize each link with title and icon
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Arrange links in your preferred order
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 4 */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <Grid className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center mb-2">
                <span className="bg-primary/20 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2 text-sm font-bold">4</span>
                Choose Your Layout
              </h2>
              <p className="text-muted-foreground mb-4">
                Select the perfect layout that suits your content and style.
              </p>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Choose between list, grid, or mixed layouts
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Decide whether to show icons, titles, or both
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Preview how your profile will look to visitors
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Step 5 */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold flex items-center mb-2">
                <span className="bg-primary/20 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2 text-sm font-bold">5</span>
                Share Your Profile
              </h2>
              <p className="text-muted-foreground mb-4">
                Share your personalized link with your audience across all platforms.
              </p>
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Get your unique profile URL
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Add it to your social media bios
                </p>
                <p className="text-sm text-muted-foreground">
                  <ChevronRight className="inline h-4 w-4 mr-1 text-primary" />
                  Share in your email signature, business cards, etc.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Ready to create your profile?</h2>
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started Now
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-8"
          >
            <ArrowUp className="mr-2 h-4 w-4" /> Back to top
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowToUse;
