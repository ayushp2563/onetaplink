import { motion } from "framer-motion";
import { LinkIcon } from "./LinkIcon";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface MixedLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const MixedLayout = ({ links, textShadowClass = "" }: MixedLayoutProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const gridItem = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  // First 2 links are displayed in a grid
  const featuredLinks = links.slice(0, 2);
  // Rest of the links are displayed in a list
  const regularLinks = links.slice(2);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {featuredLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {featuredLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={gridItem}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors shadow-md aspect-square"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <LinkIcon iconName={link.icon || "link"} className="text-white w-8 h-8" />
              </div>
              <span className={`text-white text-center line-clamp-2 ${textShadowClass}`}>
                {link.title}
              </span>
            </motion.a>
          ))}
        </div>
      )}

      {regularLinks.length > 0 && (
        <div className="space-y-3">
          {regularLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={item}
              className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors shadow-md"
            >
              <LinkIcon iconName={link.icon || "link"} className="text-white" />
              <span className={`flex-1 text-white truncate ${textShadowClass}`}>{link.title}</span>
            </motion.a>
          ))}
        </div>
      )}
    </motion.div>
  );
};
