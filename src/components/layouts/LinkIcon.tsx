
import { DynamicIcon } from "@/components/DynamicIcon";

interface LinkIconProps {
  iconName: string;
  className?: string;
}

export const LinkIcon = ({ iconName, className = "" }: LinkIconProps) => {
  return (
    <div className={`flex items-center justify-center w-6 h-6 ${className}`}>
      <DynamicIcon name={iconName || "link"} className="w-4 h-4" />
    </div>
  );
};
