
import { motion } from "framer-motion";
import { LinkIcon } from "./LinkIcon";
import { useIsMobile } from "@/hooks/use-mobile";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display?: "title" | "icon" | "both";
  photo_url?: string;
}

interface BentoLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const BentoLayout = ({ links, textShadowClass = "" }: BentoLayoutProps) => {
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
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  const gridColumns = isMobile ? "grid-cols-2" : "grid-cols-3";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${gridColumns} gap-2 max-w-lg mx-auto`}
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
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors shadow-md aspect-square cursor-pointer"
          >
            {link.photo_url ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={link.photo_url} 
                  alt={link.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (displayMode === "both" || displayMode === "icon") && (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <LinkIcon iconName={link.icon || "link"} className="text-white w-5 h-5" />
              </div>
            )}
            {(displayMode === "both" || displayMode === "title") && (
              <span className={`text-white text-center text-xs line-clamp-2 ${textShadowClass}`}>
                {link.title}
              </span>
            )}
          </motion.a>
        );
      })}
    </motion.div>
  );
};
