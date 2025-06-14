
import { LinksLayout } from "./LinksLayout";
import { BentoLayout } from "./BentoLayout";
import { MixedLayout } from "./MixedLayout";
import { LAYOUT_TYPES, LayoutType } from "@/constants/layouts";
import { Json } from "@/integrations/supabase/types";

// Define the Link interface to match what we're using in Supabase
export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  display?: "title" | "icon" | "both";
  photo_url?: string;
  [key: string]: Json | undefined; // Add index signature to make it compatible with Json type
}

interface ProfileContentProps {
  layoutType: LayoutType;
  links: Link[];
  textShadowClass?: string;
  editable?: boolean;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
}

export const ProfileContent = ({ 
  layoutType, 
  links, 
  textShadowClass = "",
  editable = false,
  onEdit,
  onDelete 
}: ProfileContentProps) => {
  switch (layoutType) {
    case LAYOUT_TYPES.BENTO:
      return <BentoLayout links={links} textShadowClass={textShadowClass} />;
    case LAYOUT_TYPES.MIXED:
      return <MixedLayout links={links} textShadowClass={textShadowClass} />;
    case LAYOUT_TYPES.LINKS:
    default:
      return (
        <LinksLayout 
          links={links} 
          textShadowClass={textShadowClass}
          editable={editable}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
  }
};
