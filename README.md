
# Personal Digital Identity Management System (PDIMS)

A comprehensive web application for managing and showcasing your digital identity. Built with modern technologies including React, TypeScript, Supabase, and Tailwind CSS.

## 🌟 Features

### Core Functionality
- **Secure Authentication** - Complete user registration and authentication system
- **Profile Management** - Customizable user profiles with avatar, bio, and personal information
- **Link Management** - Add, organize, and manage your important links
- **Visual Customization** - Multiple themes, layouts, and appearance options
- **Real-time Updates** - Instant synchronization across all your devices

### Advanced Features
- **Multiple Layout Types** - Choose from Links, Bento, or Mixed layouts
- **Theme System** - Dark/light mode with multiple color schemes
- **Custom Animations** - Smooth transitions and engaging animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **SEO Optimized** - Meta tags and social sharing optimization

### Professional Tools
- **Custom Favicon** - Upload your own favicon for branding
- **Link Analytics** - Track engagement with your shared links
- **Export Options** - Share your profile with custom URLs
- **Privacy Controls** - Granular control over what information is public

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Configure environment variables (see Configuration section)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080` to see your application running.

## ⚙️ Configuration

The application uses Supabase for backend services. Make sure to set up your Supabase project with the following tables:

### Database Schema
- `profiles` - User profile information
- `profile_settings` - User preferences and customization options

### Required Environment Variables
Configure these in your Supabase dashboard or local environment:
- Supabase project URL
- Supabase anon key
- Authentication providers (if using OAuth)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **Framer Motion** - Smooth animations and transitions

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **TanStack Query** - Data fetching and state management
- **React Router** - Client-side routing

### Development Tools
- **Vitest** - Unit and integration testing
- **Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting

## 📱 Usage Guide

### Getting Started
1. **Sign Up** - Create your account using email or OAuth providers
2. **Complete Profile** - Add your basic information, avatar, and bio
3. **Add Links** - Start adding your important links with custom icons
4. **Customize Appearance** - Choose themes, layouts, and animations
5. **Share Your Profile** - Use your custom URL to share your digital identity

### Profile Customization
- **Themes**: Choose from multiple color schemes and styles
- **Layouts**: Select from Links, Bento, or Mixed layout options
- **Animations**: Add smooth transitions and hover effects
- **Typography**: Customize fonts and text styling

### Link Management
- **Add Links**: Include title, URL, description, and custom icons
- **Organize**: Drag and drop to reorder your links
- **Customize**: Add photos, change colors, and style individual links
- **Analytics**: Track clicks and engagement (coming soon)

## 🧪 Testing

The project includes comprehensive testing coverage:

### Run Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Types
- **Unit Tests** - Individual component and function testing
- **Integration Tests** - Feature workflow testing
- **System Tests** - End-to-end user journey testing

### Test Structure
```
src/_tests_/
├── unit/           # Unit tests for components
├── integration/    # Integration tests for features
├── system/         # System-wide workflow tests
└── setup.ts        # Test configuration and mocks
```

## 🚀 Deployment

### Lovable Platform (Recommended)
1. Click the "Publish" button in the Lovable editor
2. Your app will be deployed automatically
3. Get your custom URL and start sharing

### Manual Deployment
The application can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

Popular deployment options:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔧 Development

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── integrations/  # External service integrations
└── _tests_/       # Test files
```

### Code Quality
- **TypeScript** - Strict type checking enabled
- **ESLint** - Consistent code style and best practices
- **Prettier** - Automatic code formatting
- **Husky** - Pre-commit hooks for quality assurance

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 API Documentation

### Supabase Integration
The application uses Supabase for:
- **Authentication** - User registration, login, and session management
- **Database** - Profile and settings storage
- **Storage** - File uploads (avatars, favicons, link images)

### Key API Endpoints
- User authentication and management
- Profile CRUD operations
- Settings and preferences
- File upload and management

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility (v18+)
- Clear cache: `npm run build --force`

**Authentication Issues**
- Verify Supabase configuration
- Check environment variables
- Ensure auth providers are properly configured

**Styling Issues**
- Tailwind CSS classes not working: Check build process
- Custom themes not applying: Verify theme configuration
- Responsive design issues: Test on different screen sizes

### Getting Help
- Check the [Issues](https://github.com/your-username/your-repo/issues) page
- Join our [Discord community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review the [Lovable documentation](https://docs.lovable.dev/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Lovable](https://lovable.dev) - AI-powered development platform
- [Supabase](https://supabase.com) - Backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 🔗 Links

- **Live Demo**: [View Demo Profile](https://onetaplink.vercel.app/ap25)
- **Project URL**: https://lovable.dev/projects/197d65b6-a155-4425-adcc-2b1cee8248b5
- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- **Support**: [Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

**Built with ❤️ using [Lovable](https://lovable.dev)**
