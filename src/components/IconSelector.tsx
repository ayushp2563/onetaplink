
import { useState, useEffect } from "react";
import { 
  User, Mail, Link, Github, Twitter, Facebook, Linkedin, Instagram, 
  MapPin, Bookmark, Flag, Award, Trophy, Music, Heart, Star, Camera, 
  Cloud, Sun, Moon, Smile, 
  Search
} from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define available icons with their names
const AVAILABLE_ICONS = [
  { name: "link", icon: Link },
  { name: "user", icon: User },
  { name: "mail", icon: Mail },
  { name: "github", icon: Github },
  { name: "twitter", icon: Twitter },
  { name: "facebook", icon: Facebook },
  { name: "linkedin", icon: Linkedin },
  { name: "instagram", icon: Instagram },
  { name: "map-pin", icon: MapPin },
  { name: "bookmark", icon: Bookmark },
  { name: "flag", icon: Flag },
  { name: "award", icon: Award },
  { name: "trophy", icon: Trophy },
  { name: "music", icon: Music },
  { name: "heart", icon: Heart },
  { name: "star", icon: Star },
  { name: "camera", icon: Camera },
  { name: "sun", icon: Sun },
  { name: "moon", icon: Moon },
  { name: "cloud", icon: Cloud },
  { name: "smile", icon: Smile },
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export const IconSelector = ({ selectedIcon, onSelectIcon }: IconSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIcons, setFilteredIcons] = useState(AVAILABLE_ICONS);
  
  // Find icon from the available icons list, defaulting to Link if not found
  const IconComponent = AVAILABLE_ICONS.find(i => i.name === selectedIcon)?.icon || Link;

  // Filter icons based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredIcons(AVAILABLE_ICONS);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = AVAILABLE_ICONS.filter(icon => 
      icon.name.toLowerCase().includes(query)
    );
    
    setFilteredIcons(filtered);
  }, [searchQuery]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-10 h-10" aria-label="Select icon">
          <IconComponent className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Select an Icon</h4>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ScrollArea className="h-60">
            <div className="grid grid-cols-5 gap-2">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.icon;
                return (
                  <Button
                    key={icon.name}
                    variant={selectedIcon === icon.name ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      onSelectIcon(icon.name);
                    }}
                    title={icon.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
