
import { LinksLayout } from "./LinksLayout";
import { BentoLayout } from "./BentoLayout";
import { MixedLayout } from "./MixedLayout";
import { LAYOUT_TYPES, LayoutType } from "@/constants/layouts";

// Define the Link interface to match what we're using in Supabase
export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

interface ProfileContentProps {
  layoutType: LayoutType;
  links: Link[];
  textShadowClass?: string;
}

export const ProfileContent = ({ layoutType, links, textShadowClass = "" }: ProfileContentProps) => {
  switch (layoutType) {
    case LAYOUT_TYPES.BENTO:
      return <BentoLayout links={links} textShadowClass={textShadowClass} />;
    case LAYOUT_TYPES.MIXED:
      return <MixedLayout links={links} textShadowClass={textShadowClass} />;
    case LAYOUT_TYPES.LINKS:
    default:
      return <LinksLayout links={links} textShadowClass={textShadowClass} />;
  }
};
