
import { 
  ArrowUpRight, 
  Instagram, 
  Twitter, 
  Github, 
  Youtube, 
  Linkedin, 
  Facebook, 
  Mail, 
  Globe, 
  Link as LinkIcon2, 
  Music, 
  Video, 
  Image, 
  FileText, 
  ShoppingBag, 
  Calendar, 
  MessageCircle
} from "lucide-react";

interface LinkIconProps {
  iconName: string;
  className?: string;
}

export const LinkIcon = ({ iconName, className = "" }: LinkIconProps) => {
  const iconSize = "w-5 h-5";
  const combinedClassName = `${iconSize} ${className}`;

  switch (iconName.toLowerCase()) {
    case 'instagram':
      return <Instagram className={combinedClassName} />;
    case 'twitter':
    case 'x':
      return <Twitter className={combinedClassName} />;
    case 'github':
      return <Github className={combinedClassName} />;
    case 'youtube':
      return <Youtube className={combinedClassName} />;
    case 'linkedin':
      return <Linkedin className={combinedClassName} />;
    case 'facebook':
      return <Facebook className={combinedClassName} />;
    case 'mail':
    case 'email':
      return <Mail className={combinedClassName} />;
    case 'website':
    case 'web':
      return <Globe className={combinedClassName} />;
    case 'music':
    case 'spotify':
      return <Music className={combinedClassName} />;
    case 'video':
    case 'tiktok':
      return <Video className={combinedClassName} />;
    case 'photo':
    case 'image':
      return <Image className={combinedClassName} />;
    case 'blog':
    case 'article':
      return <FileText className={combinedClassName} />;
    case 'shop':
    case 'store':
      return <ShoppingBag className={combinedClassName} />;
    case 'calendar':
    case 'event':
      return <Calendar className={combinedClassName} />;
    case 'chat':
    case 'message':
      return <MessageCircle className={combinedClassName} />;
    default:
      return <LinkIcon2 className={combinedClassName} />;
  }
};
