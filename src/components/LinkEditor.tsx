import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSelector } from "@/components/IconSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LinkIcon } from "@/components/layouts/LinkIcon";
import { PlusCircle } from "lucide-react";
import { LinksLayout } from "@/components/layouts/LinksLayout";
import { LinkPhotoUploader } from "@/components/LinkPhotoUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@/components/layouts/ProfileContent";
import { Json } from "@/integrations/supabase/types";

// Helper function to ensure URL has proper protocol
const formatUrl = (url: string): string => {
  if (!url) return "";
  
  // If URL already has a protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with //, add https:
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  
  // Otherwise, add https://
  return 'https://' + url;
};

const LinkEditor = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState<Link>({
    id: "",
    title: "",
    url: "",
    icon: "link",
    display: "both",
    photo_url: ""
  });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("You must be logged in");
          navigate("/auth");
          return;
        }

        const { data: settings, error } = await supabase
          .from('profile_settings')
          .select('links')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching links:", error);
          toast.error("Failed to load your links");
          return;
        }

        if (settings?.links) {
          const linksData = settings.links as unknown as Link[];
          // Format URLs when loading links
          const formattedLinks = Array.isArray(linksData) ? linksData.map(link => ({
            ...link,
            url: formatUrl(link.url)
          })) : [];
          setLinks(formattedLinks);
        }
      } catch (error) {
        console.error("Error in links fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (iconName: string) => {
    setFormData(prev => ({
      ...prev,
      icon: iconName
    }));
  };

  const handlePhotoUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photo_url: url
    }));
  };

  const handlePhotoRemoved = () => {
    setFormData(prev => ({
      ...prev,
      photo_url: ""
    }));
  };

  const handleAddLink = () => {
    if (!formData.title || !formData.url) {
      toast.error("Title and URL are required");
      return;
    }

    // Format the URL before saving
    const formattedUrl = formatUrl(formData.url);

    if (editingLink) {
      // Update existing link
      const updatedLinks = links.map(link => 
        link.id === editingLink.id ? { ...formData, id: link.id, url: formattedUrl } : link
      );
      setLinks(updatedLinks);
      toast.success("Link updated successfully");
      setEditingLink(null);
    } else {
      // Add new link
      const newLink: Link = {
        ...formData,
        id: crypto.randomUUID(),
        url: formattedUrl
      };
      setLinks(prev => [...prev, newLink]);
      toast.success("Link added successfully");
    }

    setFormData({
      id: "",
      title: "",
      url: "",
      icon: "link",
      display: "both",
      photo_url: ""
    });
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setFormData({
      id: link.id,
      title: link.title,
      url: link.url,
      icon: link.icon || "link",
      display: link.display || "both",
      photo_url: link.photo_url || ""
    });
  };

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    toast.success("Link deleted");
    
    if (editingLink?.id === id) {
      setEditingLink(null);
      setFormData({
        id: "",
        title: "",
        url: "",
        icon: "link",
        display: "both",
        photo_url: ""
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("You must be logged in");
        navigate("/auth");
        return;
      }

      // Ensure all URLs are properly formatted before saving
      const formattedLinks = links.map(link => ({
        ...link,
        url: formatUrl(link.url)
      }));

      // Cast links array to Json type for Supabase
      const linksJson = formattedLinks as unknown as Json;

      const { error } = await supabase
        .from('profile_settings')
        .update({
          links: linksJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) {
        console.error("Error saving links:", error);
        toast.error("Failed to save your links");
        return;
      }

      toast.success("Links saved successfully");
      navigate("/appearance");
    } catch (error) {
      console.error("Error in save operation:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/appearance");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Link Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter link title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://example.com or example.com"
                  value={formData.url}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  You can enter with or without https:// - we'll add it automatically
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon & Display</Label>
                <div className="flex items-center gap-2">
                  <IconSelector
                    selectedIcon={formData.icon || "link"}
                    onSelectIcon={handleIconSelect}
                  />
                  <div className="flex-1">
                    <Select
                      value={formData.display || "both"}
                      onValueChange={(value) => handleSelectChange("display", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Display" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">Icon & Title</SelectItem>
                        <SelectItem value="icon">Icon Only</SelectItem>
                        <SelectItem value="title">Title Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <LinkPhotoUploader
                  onPhotoUploaded={handlePhotoUploaded}
                  currentPhotoUrl={formData.photo_url}
                  onPhotoRemoved={handlePhotoRemoved}
                />
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleAddLink}
              className="w-full"
            >
              {editingLink ? "Update Link" : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {links.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Links</CardTitle>
          </CardHeader>
          <CardContent>
            <LinksLayout 
              links={links} 
              editable={true} 
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <div className="space-y-2">
            <p className="text-muted-foreground">No links added yet</p>
            <LinkIcon iconName="link" className="mx-auto text-muted-foreground h-12 w-12" />
          </div>
        </Card>
      )}
      
      <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-4`}>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className={isMobile ? 'w-full' : ''}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={isMobile ? 'w-full' : ''}
        >
          {isSaving ? "Saving..." : "Save Links"}
        </Button>
      </div>
    </div>
  );
};

export default LinkEditor;
