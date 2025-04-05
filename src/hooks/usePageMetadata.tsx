
import { useEffect } from 'react';

interface PageMetadataProps {
  title?: string;
  faviconUrl?: string;
}

export function usePageMetadata({ title, faviconUrl }: PageMetadataProps) {
  useEffect(() => {
    // Set page title if provided
    if (title) {
      document.title = title;
    }

    // Set favicon if provided
    if (faviconUrl) {
      // Look for existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      
      // Remove them
      existingFavicons.forEach(favicon => {
        document.head.removeChild(favicon);
      });
      
      // Create new favicon link
      const faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.href = faviconUrl;
      faviconLink.type = 'image/x-icon';
      
      document.head.appendChild(faviconLink);
    }
    
    // Cleanup function to restore original title and favicon when component unmounts
    return () => {
      // We don't restore the title here as it's typically handled by the router
      
      // For favicon, we could restore the original, but it's usually not necessary
      // as navigating away will set the appropriate favicon for the new page
    };
  }, [title, faviconUrl]);
}
