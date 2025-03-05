
import { LinksLayout } from "./LinksLayout";
import { BentoLayout } from "./BentoLayout";
import { MixedLayout } from "./MixedLayout";
import { LAYOUT_TYPES } from "@/constants/layouts";

interface Link {
  id: string;
  title: string;
  url: string;
}

interface ProfileContentProps {
  layoutType: string;
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
