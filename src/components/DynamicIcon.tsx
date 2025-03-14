
import { 
  User, Mail, Link, Github, Twitter, Facebook, Linkedin, Instagram, 
  MapPin, Bookmark, Flag, Award, Trophy, Music, Heart, Star, Camera, 
  Cloud, Sun, Moon, Smile, LucideProps 
} from "lucide-react";

// Map of icon names to components
const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  user: User,
  mail: Mail,
  link: Link,
  github: Github,
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  "map-pin": MapPin,
  bookmark: Bookmark,
  flag: Flag,
  award: Award,
  trophy: Trophy,
  music: Music,
  heart: Heart,
  star: Star,
  camera: Camera,
  cloud: Cloud,
  sun: Sun,
  moon: Moon,
  smile: Smile,
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = ICON_MAP[name] || Link; // Fallback to Link
  return <IconComponent {...props} />;
};
