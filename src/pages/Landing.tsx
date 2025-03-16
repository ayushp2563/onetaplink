
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Hero Section */}
      <div className="container max-w-6xl px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary/30 to-accent/30 p-6 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4"
          >
            <img src="/main-logo-black-transparent.svg" alt="One Tap Link" className="w-24 h-24" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Digital Identity in One Place
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share all your important links in one beautiful, customizable profile that represents you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="w-full sm:w-auto">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">Features that make us special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-muted-foreground">
                Create your profile in minutes, no technical knowledge required. Our intuitive editor makes it simple.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-muted-foreground">
                Choose from beautiful themes, layouts and animations to make your profile truly unique.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
              <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Anywhere</h3>
              <p className="text-muted-foreground">
                Share your profile on social media, in your bio, email signature, or anywhere else with a simple link.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-10 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of creators who are already sharing their links with style.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="w-full sm:w-auto">
                Create Your Profile
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/how-to-use")} className="w-full sm:w-auto">
                Learn How It Works
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
