
# PDIMS Design System Documentation

## Overview
PDIMS (Personal Digital Identity Management System) is a modern link-in-bio platform with a clean, professional design focused on user experience and accessibility.

## Color Palette

### Primary Colors
- **Primary Green**: `hsl(142.1, 76.2%, 36.3%)` - Used for CTAs, links, and brand elements
- **Primary Foreground**: `hsl(355.7, 100%, 97.3%)` - Text on primary backgrounds

### Background Colors
- **Light Mode Background**: `hsl(0, 0%, 100%)` - Pure white
- **Dark Mode Background**: `hsl(240, 10%, 4%)` - Deep dark blue
- **Card Background**: Glass morphism with `bg-white/10` and `backdrop-blur-sm`

### Text Colors
- **Primary Text**: `hsl(240, 10%, 3.9%)` (light) / `hsl(0, 0%, 98%)` (dark)
- **Muted Text**: `hsl(240, 3.8%, 46.1%)` (light) / `hsl(240, 5%, 64.9%)` (dark)
- **Link Color**: `hsl(221.2, 83.2%, 53.3%)` (light) / `hsl(221.2, 83.2%, 65%)` (dark)

### UI Colors
- **Border**: `hsl(240, 5.9%, 90%)` (light) / `hsl(240, 3.7%, 15.9%)` (dark)
- **Input Background**: Same as border colors
- **Accent**: `hsl(240, 4.8%, 95.9%)` (light) / `hsl(240, 3.7%, 15.9%)` (dark)

## Typography

### Font Families
- **Primary (Sans)**: Inter - Used for body text and most UI elements
- **Display**: Montserrat - Used for headings and emphasis
- **Serif**: Playfair Display - Available for elegant styling
- **Monospace**: Roboto Mono - Used for code and technical content

### Font Sizes & Hierarchy
- **H1**: `text-2xl` (24px) mobile, `text-3xl+` desktop
- **H2**: `text-xl` (20px) mobile, `text-2xl` desktop
- **H3**: `text-lg` (18px)
- **Body**: `text-sm` (14px) mobile, `text-base` (16px) desktop
- **Small**: `text-xs` (12px)

### Font Weights
- **Regular**: 400
- **Medium**: 500 - Used for emphasis
- **Semibold**: 600 - Used for headings
- **Bold**: 700 - Used for strong emphasis
- **Extrabold**: 800 - Used for main headings

## Layout & Spacing

### Container Sizes
- **Max Width**: 1400px (2xl breakpoint)
- **Content Max Width**: 512px (max-w-2xl) for forms and content
- **Card Content**: 448px (max-w-lg) for link layouts

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: 1024px+

### Spacing Scale
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 3rem (48px)

## Components

### Buttons
- **Primary**: Green background with white text, rounded corners
- **Secondary**: Muted background with primary text
- **Ghost**: Transparent with hover accent background
- **Destructive**: Red background for dangerous actions
- **Sizes**: Small (h-9), Default (h-10), Large (h-11), Icon (h-10 w-10)

### Cards
- **Standard**: White background with subtle border and shadow
- **Glass**: Semi-transparent with backdrop blur effect
- **Hover Effects**: Scale transform and enhanced shadow
- **Border Radius**: 0.75rem (12px)

### Navigation
- **Navbar**: Sticky header with backdrop blur
- **Mobile Menu**: Full-screen overlay with smooth animations
- **Active States**: Primary color with background highlight

### Forms
- **Input Fields**: Consistent padding, border radius, and focus states
- **Labels**: Clear hierarchy with proper spacing
- **Validation**: Error states with red accent
- **Touch Targets**: Minimum 44px height for mobile

### Link Layouts
1. **List Layout**: Vertical stack with icons and titles
2. **Bento Grid**: 2-3 column grid with square cards
3. **Mixed Layout**: Combination of featured grid items and list items

## Visual Effects

### Shadows
- **Subtle**: `0 2px 10px rgba(0, 0, 0, 0.05)`
- **Card**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **Floating**: `0 8px 30px rgba(0, 0, 0, 0.12)`
- **Glow**: Primary color glow effect for focus states

### Animations
- **Page Transitions**: Fade and slide effects (0.3s duration)
- **Hover States**: Scale and color transitions (0.2s duration)
- **Loading**: Subtle pulse and spin animations
- **Entrance**: Staggered fade-in for lists and grids

### Glass Morphism
- **Background**: `bg-white/10` (light) / `bg-black/20` (dark)
- **Backdrop Filter**: `backdrop-blur-sm` or `backdrop-blur-lg`
- **Border**: `border-white/20` or `border-black/20`

## User Experience Patterns

### Navigation Flow
1. **Landing Page** → **Authentication** → **Dashboard**
2. **Profile Creation** → **Link Management** → **Appearance Customization**
3. **Public Profile** viewing with clean, distraction-free design

### Responsive Behavior
- **Mobile-first** approach with progressive enhancement
- **Touch-friendly** interactive elements (44px minimum)
- **Readable** text sizes across all devices
- **Accessible** color contrast ratios (WCAG AA compliant)

### Dark Mode
- **Automatic** system preference detection
- **Manual** toggle available in navigation
- **Consistent** component behavior across themes
- **Smooth** transitions between light and dark modes

## Accessibility

### Color Contrast
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **Interactive Elements**: Clear focus indicators

### Interactive Elements
- **Focus States**: Visible ring with primary color
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML

### Touch Targets
- **Minimum Size**: 44px × 44px
- **Adequate Spacing**: Between interactive elements
- **Clear Affordances**: Visual cues for interactive elements

## Brand Guidelines

### Logo Usage
- **Primary Mark**: Shield icon with "PDIMS" wordmark
- **Icon Only**: Shield symbol for favicons and small spaces
- **Color Variations**: Primary green, white, and monochrome versions

### Voice & Tone
- **Professional** yet approachable
- **Clear** and concise messaging
- **Helpful** and supportive user guidance
- **Modern** and tech-forward language

### Visual Style
- **Minimal** and clean aesthetic
- **Modern** with subtle gradients and effects
- **Professional** color palette
- **Consistent** spacing and typography

## Implementation Notes

### CSS Variables
All colors and spacing use CSS custom properties for easy theming and maintenance.

### Component Library
Built on Radix UI primitives with custom styling using Tailwind CSS classes.

### Animation Library
Framer Motion for complex animations and page transitions.

### Icon System
Lucide React for consistent, scalable vector icons throughout the application.

---

This design system serves as the foundation for all visual and interactive elements in PDIMS, ensuring consistency and quality across the entire platform.
