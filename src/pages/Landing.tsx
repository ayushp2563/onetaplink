
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, ExternalLink, Link as LinkIcon, Palette, Lock } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 md:pt-32 md:pb-20">
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4"
            >
              <img src="/main-logo-black-transparent.svg" alt="One Tap Link" className="w-16 h-16" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold"
            >
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                One Link to Share
              </span>
              <br />
              <span>Everything About You</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Create a beautiful, customizable profile page with all your important links, 
              ready to share anywhere online.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto group"
              >
                Get Started 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/how-to-use")}
                className="w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Abstract design elements */}
        <div className="absolute top-40 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-accent/5 rounded-full filter blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need in One Profile</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform gives you all the tools to create a personalized online presence that represents you perfectly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <LinkIcon className="text-primary h-6 w-6" />,
                title: "Unlimited Links",
                description: "Add as many links as you want to your profile. Social media, websites, portfolios, and more.",
                delay: 0
              },
              {
                icon: <Palette className="text-primary h-6 w-6" />,
                title: "Custom Themes",
                description: "Choose from multiple beautiful themes or customize your own to match your personal style.",
                delay: 1
              },
              {
                icon: <Lock className="text-primary h-6 w-6" />,
                title: "Secure & Private",
                description: "Your data is always safe. You control what information is shared on your profile.",
                delay: 2
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="card-highlight p-6 rounded-xl bg-card shadow-subtle hover:shadow-card-hover transition-all duration-200"
              >
                <div className="bg-primary/10 dark:bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">Why Choose One Tap Link?</h2>
              <div className="space-y-4">
                {[
                  "Easy to set up in just a few minutes",
                  "Works perfectly on all devices",
                  "Detailed analytics to track your visitors",
                  "Customizable appearance to match your brand",
                  "Free to use with premium options available"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="relative mx-auto max-w-sm">
                {/* Phone mockup */}
                <div className="rounded-[3rem] border-8 border-foreground/10 shadow-xl bg-background p-2 overflow-hidden">
                  <div className="rounded-[2.4rem] overflow-hidden relative aspect-[9/19] flex items-center justify-center">
                    <div className="absolute top-0 left-0 right-0 h-12 bg-foreground/5 z-10 rounded-t-[2.4rem] flex items-center justify-center">
                      <div className="w-1/3 h-6 rounded-full bg-foreground/10"></div>
                    </div>
                    <div className="w-full h-full bg-gradient-to-b from-primary/10 to-accent/10 flex flex-col items-center pt-16 px-4">
                      <div className="w-20 h-20 rounded-full bg-white shadow-md"></div>
                      <div className="mt-4 w-3/4 h-5 bg-white/70 rounded-md"></div>
                      <div className="mt-2 w-2/4 h-4 bg-white/50 rounded-md"></div>
                      <div className="mt-6 w-full space-y-3">
                        <div className="w-full h-12 bg-white/80 rounded-lg"></div>
                        <div className="w-full h-12 bg-white/80 rounded-lg"></div>
                        <div className="w-full h-12 bg-white/80 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[3.5rem] opacity-40 blur-xl -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-4">Ready to Create Your Profile?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of creators, influencers, and professionals who are already sharing their links with style.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="w-full sm:w-auto"
                >
                  Create Your Profile
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open("https://onetaplink.vercel.app/ap25", "_blank")}
                  className="w-full sm:w-auto gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Demo Profile
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <img src="/main-logo-black-transparent.svg" alt="One Tap Link" className="h-8 w-8 mr-2" />
              <span className="font-semibold">One Tap Link</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} One Tap Link. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/how-to-use")}>
                How It Works
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
