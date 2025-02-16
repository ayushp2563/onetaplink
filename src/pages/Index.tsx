
import { Link2, Share2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

const DEMO_LINKS: Link[] = [
  {
    id: "1",
    title: "My Personal Website",
    url: "https://example.com",
  },
  {
    id: "2",
    title: "Latest Blog Post",
    url: "https://example.com/blog",
  },
  {
    id: "3",
    title: "Connect on LinkedIn",
    url: "https://linkedin.com",
  },
];

const Index = () => {
  const [links] = useState<Link[]>(DEMO_LINKS);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
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
              className="relative w-full h-full rounded-full object-cover border-2 border-white"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your Name</h1>
          <p className="text-muted-foreground">Digital Creator & Developer</p>
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
                    <Link2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button className="inline-flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share Profile</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
