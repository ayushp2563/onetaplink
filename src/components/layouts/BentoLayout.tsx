
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface BentoLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const BentoLayout = ({ links, textShadowClass = "" }: BentoLayoutProps) => {
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
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {links.map((link) => (
        <motion.div
          key={link.id}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            show: { opacity: 1, scale: 1 },
          }}
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all hover:scale-[1.03] h-full flex flex-col justify-between"
          >
            <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center mb-3">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            
            <div>
              <h3 className={`text-lg font-medium text-white mb-1 ${textShadowClass}`}>
                {link.title}
              </h3>
              <p className={`text-sm text-white/70 truncate ${textShadowClass}`}>
                {link.url && (link.url.startsWith('http') ? 
                  (() => {
                    try {
                      return new URL(link.url).hostname;
                    } catch (e) {
                      return link.url;
                    }
                  })() : link.url)}
              </p>
            </div>
          </a>
        </motion.div>
      ))}
    </motion.div>
  );
};
