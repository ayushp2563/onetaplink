
import { motion } from "framer-motion";
import { LinkIcon } from "./LinkIcon";
import { useIsMobile } from "@/hooks/use-mobile";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display?: "title" | "icon" | "both";
}

interface LinksLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const LinksLayout = ({ links, textShadowClass = "" }: LinksLayoutProps) => {
  const isMobile = useIsMobile();
  
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3 w-full max-w-lg mx-auto px-2 sm:px-0"
    >
      {links.map((link) => {
        const displayMode = link.display || "both";
        
        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={item}
            className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors shadow-md"
          >
            {(displayMode === "both" || displayMode === "icon") && (
              <LinkIcon iconName={link.icon || "link"} className="text-white" />
            )}
            {(displayMode === "both" || displayMode === "title") && (
              <span className={`flex-1 text-white truncate ${textShadowClass} ${isMobile ? 'text-sm' : ''}`}>
                {link.title}
              </span>
            )}
          </motion.a>
        );
      })}
    </motion.div>
  );
};
