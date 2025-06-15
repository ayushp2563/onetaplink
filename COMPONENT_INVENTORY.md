
# PDIMS Component Inventory

## Navigation Components

### Navbar (`src/components/Navbar.tsx`)
- **Purpose**: Main navigation header with authentication state
- **Features**: Responsive design, mobile menu, theme toggle, user avatar
- **States**: Authenticated/unauthenticated, mobile/desktop
- **Key Elements**: Logo, navigation links, user actions, mobile hamburger menu

## Layout Components

### Link Layouts (`src/components/layouts/`)

#### LinksLayout (`LinksLayout.tsx`)
- **Purpose**: Vertical list layout for links
- **Features**: Icon display, edit/delete actions, responsive text sizing
- **Use Case**: Default link display in profile pages

#### BentoLayout (`BentoLayout.tsx`)
- **Purpose**: Grid-based layout for links
- **Features**: Square cards, 2-3 column responsive grid, centered content
- **Use Case**: Modern, visual link presentation

#### MixedLayout (`MixedLayout.tsx`)
- **Purpose**: Hybrid layout combining grid and list
- **Features**: Featured links in grid, remaining links in list format
- **Use Case**: Highlighting important links while maintaining hierarchy

#### LinkIcon (`LinkIcon.tsx`)
- **Purpose**: Dynamic icon component for links
- **Features**: Lucide icon integration, fallback handling
- **Use Case**: Consistent iconography across link layouts

#### ProfileContent (`ProfileContent.tsx`)
- **Purpose**: Main profile display component
- **Features**: User info, bio, links, customizable layouts
- **Use Case**: Public-facing profile pages

## Page Components

### LinkEditorPage (`src/pages/LinkEditorPage.tsx`)
- **Purpose**: Link management interface
- **Features**: Authentication check, navigation, link editing
- **Access**: Protected route for authenticated users
- **Layout**: Centered container with back navigation

## UI Components (Shadcn/UI)

### Button (`src/components/ui/button.tsx`)
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon
- **Features**: Loading states, icon support, accessibility

### Form Components
- **Input**: Text input with validation states
- **Label**: Accessible form labels
- **Select**: Dropdown selection component
- **Textarea**: Multi-line text input
- **Checkbox**: Boolean input component
- **Radio Group**: Single selection from multiple options

### Layout Components
- **Card**: Content container with optional header/footer
- **Separator**: Visual divider component
- **Sheet**: Slide-out panel component
- **Dialog**: Modal dialog component
- **Popover**: Floating content component
- **Tooltip**: Hover information component

### Navigation Components
- **Tabs**: Horizontal navigation tabs
- **Accordion**: Collapsible content sections
- **Breadcrumb**: Navigation trail component
- **Pagination**: Page navigation component

### Display Components
- **Avatar**: User profile image component
- **Badge**: Status/category indicator
- **Progress**: Loading/completion indicator
- **Skeleton**: Loading placeholder component
- **Alert**: Notification/message component

### Interactive Components
- **Switch**: Toggle control component
- **Slider**: Range input component
- **Calendar**: Date selection component
- **Command**: Search/command palette
- **Context Menu**: Right-click menu component
- **Dropdown Menu**: Action menu component
- **Hover Card**: Preview on hover component
- **Menubar**: Horizontal menu bar
- **Navigation Menu**: Main navigation component
- **Toggle**: Binary state component
- **Toggle Group**: Multiple toggle component

## Theme Components

### ThemeProvider (`src/components/theme-provider.tsx`)
- **Purpose**: Theme context management
- **Features**: Light/dark mode, system preference detection
- **Storage**: Persistent theme preference

### ThemeToggle (`src/components/theme-toggle.tsx`)
- **Purpose**: Theme switching interface
- **Features**: Sun/moon icons, smooth transitions
- **Integration**: Works with ThemeProvider context

## Authentication Components

### AuthProvider (`src/components/AuthProvider.tsx`)
- **Purpose**: Authentication state management
- **Features**: Session handling, user data, sign out functionality
- **Integration**: Supabase authentication

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- **Purpose**: Route protection for authenticated users
- **Features**: Automatic redirect, loading states
- **Use Case**: Protecting dashboard and editing pages

## Utility Components

### AvatarUploader (`src/components/AvatarUploader.tsx`)
- **Purpose**: Profile image upload interface
- **Features**: File selection, preview, upload progress
- **Integration**: Supabase storage

### DynamicIcon (`src/components/DynamicIcon.tsx`)
- **Purpose**: Dynamic icon loading component
- **Features**: Icon name to component mapping
- **Use Case**: Flexible icon display

### FaviconUploader (`src/components/FaviconUploader.tsx`)
- **Purpose**: Site favicon upload interface
- **Features**: File validation, preview, storage integration
- **Use Case**: Profile customization

### IconSelector (`src/components/IconSelector.tsx`)
- **Purpose**: Icon selection interface
- **Features**: Icon grid, search, selection state
- **Use Case**: Link icon assignment

### LinkEditor (`src/components/LinkEditor.tsx`)
- **Purpose**: Link management interface
- **Features**: Add, edit, delete, reorder links
- **Integration**: Database operations, file uploads

### LinkPhotoUploader (`src/components/LinkPhotoUploader.tsx`)
- **Purpose**: Link image upload component
- **Features**: Image upload, preview, cropping
- **Use Case**: Custom link thumbnails

### ProfileForm (`src/components/ProfileForm.tsx`)
- **Purpose**: Profile editing interface
- **Features**: Form validation, image uploads, bio editing
- **Integration**: Database updates, file storage

## Hooks

### usePageMetadata (`src/hooks/usePageMetadata.tsx`)
- **Purpose**: Dynamic page title and meta management
- **Features**: SEO optimization, dynamic titles
- **Use Case**: Page-specific metadata

### use-mobile (`src/hooks/use-mobile.tsx`)
- **Purpose**: Mobile device detection
- **Features**: Responsive breakpoint detection
- **Use Case**: Conditional mobile layouts

### use-toast (`src/hooks/use-toast.ts`)
- **Purpose**: Toast notification management
- **Features**: Success, error, info notifications
- **Integration**: Sonner toast library

## Styling System

### Tailwind Configuration (`tailwind.config.ts`)
- **Custom Colors**: Brand color palette with CSS variables
- **Animations**: Custom keyframes and animations
- **Typography**: Font family and text utilities
- **Shadows**: Custom shadow utilities
- **Responsive**: Mobile-first breakpoints

### Global Styles (`src/index.css`)
- **CSS Variables**: Theme-based color system
- **Base Styles**: Typography, layout, accessibility
- **Utility Classes**: Custom components and effects
- **Animations**: Keyframe definitions
- **Responsive**: Mobile optimizations

## Key Features

### Responsive Design
- **Mobile-first** approach with progressive enhancement
- **Flexible** layouts that adapt to screen size
- **Touch-friendly** interactive elements

### Accessibility
- **WCAG AA** compliant color contrast
- **Keyboard navigation** support
- **Screen reader** friendly markup
- **Focus management** for interactive elements

### Performance
- **Tree-shaking** with ES modules
- **Lazy loading** for dynamic content
- **Optimized** images and assets
- **Minimal** bundle size

### User Experience
- **Smooth** animations and transitions
- **Consistent** interaction patterns
- **Clear** visual hierarchy
- **Intuitive** navigation flow

---

This component inventory provides a complete overview of all UI elements and their relationships within the PDIMS application.
