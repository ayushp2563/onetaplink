
import { Link2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface LinksLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const LinksLayout = ({ links, textShadowClass = "" }: LinksLayoutProps) => {
  if (!links || links.length === 0) {
    return (
      <div className="text-center text-white/70 py-4">
        <p className={textShadowClass}>No links added yet</p>
      </div>
    );
  }
  
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
      className="space-y-4"
    >
      {links.map((link) => (
        <motion.div
          key={link.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link2 className="w-5 h-5 text-white" />
                <span className={`font-medium text-white ${textShadowClass}`}>{link.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/70" />
            </div>
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
};
