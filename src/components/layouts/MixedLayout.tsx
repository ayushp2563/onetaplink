
import { motion } from "framer-motion";
import { Link2, ChevronRight } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface MixedLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const MixedLayout = ({ links, textShadowClass = "" }: MixedLayoutProps) => {
  if (!links || links.length === 0) {
    return (
      <div className="text-center text-white/70 py-4">
        <p className={textShadowClass}>No links added yet</p>
      </div>
    );
  }
  
  // First link is displayed prominently at the top
  const featuredLink = links[0];
  // Remaining links are shown in a list below
  const remainingLinks = links.slice(1);
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Featured link in bento style */}
      {featuredLink && (
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            show: { opacity: 1, scale: 1 },
          }}
        >
          <a
            href={featuredLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all hover:scale-[1.02]"
          >
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Link2 className="w-6 h-6 text-white" />
            </div>
            
            <h3 className={`text-xl font-medium text-white mb-2 ${textShadowClass}`}>
              {featuredLink.title}
            </h3>
            <p className={`text-sm text-white/70 ${textShadowClass}`}>
              {new URL(featuredLink.url).hostname}
            </p>
          </a>
        </motion.div>
      )}
      
      {/* Remaining links in list style */}
      {remainingLinks.length > 0 && (
        <div className="space-y-3">
          {remainingLinks.map((link) => (
            <motion.div
              key={link.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Link2 className="w-4 h-4 text-white" />
                    <span className={`font-medium text-white ${textShadowClass}`}>{link.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/70" />
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
