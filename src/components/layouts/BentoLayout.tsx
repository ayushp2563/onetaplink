
import { motion } from "framer-motion";
import { LinkIcon } from "./LinkIcon";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface BentoLayoutProps {
  links: Link[];
  textShadowClass?: string;
}

export const BentoLayout = ({ links, textShadowClass = "" }: BentoLayoutProps) => {
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3"
    >
      {links.map((link) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          variants={item}
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
    </motion.div>
  );
};
