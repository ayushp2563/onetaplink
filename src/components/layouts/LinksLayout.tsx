
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

interface LinksLayoutProps {
  links: Link[];
  textShadowClass?: string;
  editable?: boolean;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
}

export const LinksLayout = ({ 
  links, 
  textShadowClass = "",
  editable = false,
  onEdit,
  onDelete
}: LinksLayoutProps) => {
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
          <motion.div
            key={link.id}
            variants={item}
            className="relative"
          >
            {editable && (
              <div className="absolute right-2 top-2 flex gap-2 z-10">
                {onEdit && (
                  <button
                    onClick={() => onEdit(link)}
                    className="p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-white transition-colors"
                    aria-label="Edit link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="m15 5 4 4"/>
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(link.id)}
                    className="p-2 rounded-full bg-red-600/80 hover:bg-red-500/80 text-white transition-colors"
                    aria-label="Delete link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
            <motion.a
              href={editable ? "#" : link.url}
              target={editable ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm ${!editable ? 'hover:bg-white/20' : ''} transition-colors shadow-md w-full`}
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
                <LinkIcon iconName={link.icon || "link"} className="text-white flex-shrink-0" />
              )}
              {(displayMode === "both" || displayMode === "title") && (
                <span className={`flex-1 text-white truncate ${textShadowClass} ${isMobile ? 'text-sm' : ''}`}>
                  {link.title}
                </span>
              )}
            </motion.a>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
