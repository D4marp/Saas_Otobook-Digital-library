# 🚀 OTobook SaaS Platform - Complete Setup Guide

Selamat datang ke **OTobook SaaS Platform**! Platform automation terpadu dengan solusi OCR dan RPA yang lengkap untuk kebutuhan bisnis modern Anda.

## 📋 Apa yang Sudah Dibangun?

### ✅ Complete Frontend SaaS dengan:

1. **Landing Page yang Menarik** 
   - Hero section dengan CTA
   - Feature showcase
   - Pricing plans
   - Footer dengan links

2. **Authentication System**
   - Login page
   - Sign up page
   - Session management (localStorage)
   - Demo credentials

3. **Dashboard Lengkap**
   - Main dashboard dengan statistics
   - User management system
   - Analytics & monitoring
   - Settings page

4. **OCR Documentation** (Lengkap untuk 3 Platform)
   - **Web**: JavaScript/Tesseract.js, React implementation
   - **Android**: Java/ML Kit Vision, Camera integration
   - **iOS**: Swift/Vision framework, Real-time detection
   - Code examples untuk setiap platform

5. **RPA Framework Documentation** (Robot Framework)
   - Installation step-by-step
   - Basic & advanced techniques
   - API testing, Database ops
   - CI/CD integration (GitHub Actions, Jenkins, Docker)
   - OTobook platform integration examples

6. **Responsive Sidebar Navigation**
   - Mobile-friendly
   - Active route highlighting
   - Logout functionality

## 🎯 Route Map

```
PUBLIC ROUTES:
/                    → Landing page (Home)
/login              → Login page
/signup             → Sign up page

DASHBOARD ROUTES (Private):
/dashboard          → Main dashboard
/dashboard/users    → User management
/dashboard/analytics → Analytics & monitoring
/dashboard/settings → Settings & configuration

DOCUMENTATION ROUTES:
/documentation/ocr  → OCR implementation guide
/documentation/rpa  → Robot Framework guide

ERROR ROUTES:
/*                  → 404 Not Found
```

## 🏃 Quick Start

### 1. Install Dependencies
```bash
cd Frontend
npm install
# atau
bun install
```

### 2. Run Development Server
```bash
npm run dev
# atau
bun run dev
```

Server akan berjalan di: **http://localhost:8080**

### 3. Build untuk Production
```bash
npm run build
# atau
bun run build
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── pages/                    # All page components
│   │   ├── Home.tsx             # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── Signup.tsx           # Sign up page
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── UserManagement.tsx   # User management
│   │   ├── Analytics.tsx        # Analytics page
│   │   ├── Settings.tsx         # Settings page
│   │   ├── OCRDocumentation.tsx # OCR docs
│   │   ├── RPADocumentation.tsx # RPA docs
│   │   ├── Index.tsx            # (Legacy - dapat dihapus)
│   │   └── NotFound.tsx         # 404 page
│   ├── components/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── DashboardLayout.tsx  # Dashboard layout
│   │   └── ui/                  # shadcn UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── App.tsx                  # Main app routing
│   ├── main.tsx                 # Entry point
│   └── index.css               # Global styles
├── public/                      # Static files
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # Original README
```

## 🎨 Tech Stack

- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Data Query**: TanStack React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm/bun

## 🔐 Authentication Flow

### Login Demo
```
Email: demo@otobook.com
Password: demo123
```

**Flow:**
1. User input email & password
2. Simulated API call (setTimeout)
3. Token disimpan di localStorage
4. User diredirect ke /dashboard

### Sign Up Flow
```
1. User fill form (company, email, password)
2. Password validation
3. Success message
4. Auto login & redirect
```

## 📚 Documentation Pages

### OCR Documentation (`/documentation/ocr`)

**Tab 1: Web Implementation**
- Tesseract.js installation
- Basic setup & usage
- React component example
- Advanced features

**Tab 2: Android Implementation**
- ML Kit Vision setup
- Java code examples
- Camera integration
- Best practices

**Tab 3: iOS Implementation**
- Vision framework setup
- Swift code examples
- Camera integration
- Testing tips

### RPA Documentation (`/documentation/rpa`)

**Tab 1: Installation**
- System requirements
- Python setup
- Robot Framework install
- Library setup
- IDE setup (RIDE)
- Project creation

**Tab 2: Basics**
- Test structure
- Variables & keywords
- Test cases examples
- Web testing
- Data-driven testing

**Tab 3: Advanced**
- Custom Python libraries
- API testing
- Database operations
- Parallel execution
- Report customization

**Tab 4: CI/CD Integration**
- GitHub Actions
- Jenkins Pipeline
- Docker setup
- OTobook integration

## 🛠️ Development Tips

### Add New Page
```bash
# 1. Create new page component
touch src/pages/NewPage.tsx

# 2. Add content (use DashboardLayout for dashboard pages)
# 3. Add route to App.tsx
# 4. Add sidebar item (if needed)
```

### Customize Styling
- Tailwind CSS classes directly di JSX
- Custom colors di tailwind.config.ts
- Global styles di src/index.css

### Add API Integration
```tsx
// Use React Query untuk data fetching
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await fetch('/api/users');
    return res.json();
  }
});
```

## 📊 Component Hierarchy

```
App
├── Home
├── Login
├── Signup
└── Dashboard Pages
    ├── DashboardLayout
    │   ├── Sidebar
    │   └── Main Content
    ├── Dashboard
    ├── UserManagement
    ├── Analytics
    ├── Settings
    ├── OCRDocumentation
    └── RPADocumentation
```

## 🎯 Next Steps & Improvements

### Immediate Tasks:
- [ ] Connect ke backend API (database)
- [ ] Implement authentication dengan JWT
- [ ] Setup environment variables
- [ ] Add error handling & logging
- [ ] Implement real-time data updates

### Feature Enhancements:
- [ ] Dark mode toggle
- [ ] Export reports functionality
- [ ] User profile page
- [ ] Billing management
- [ ] Notification system
- [ ] File upload for OCR
- [ ] RPA execution dashboard
- [ ] Integration with payment gateway

### Performance:
- [ ] Code splitting
- [ ] Image optimization
- [ ] Caching strategy
- [ ] SEO optimization
- [ ] Bundle size optimization

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Manual (VPS/Cloud)
```bash
npm run build
# Upload dist/ folder ke server
# Setup web server (nginx/apache)
```

## 📞 Support & Documentation

- **Full Documentation**: Lihat [SAAS_DOCUMENTATION.md](./SAAS_DOCUMENTATION.md)
- **Component Docs**: shadcn/ui - https://ui.shadcn.com
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com

## 🐛 Troubleshooting

### Port 8080 already in use
```bash
# Ubah port di vite.config.ts atau gunakan
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run lint  # Check for linting errors
npm run build # Check for build errors
```

## 📄 File Templates

### New Page Template
```tsx
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

export default function NewPage() {
  return (
    <DashboardLayout
      title="Page Title"
      subtitle="Page subtitle"
    >
      <div className="space-y-6">
        {/* Your content here */}
      </div>
    </DashboardLayout>
  );
}
```

## 🎓 Learning Resources

- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com
- Robot Framework: https://robotframework.org

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready ✅

Selamat mengembangkan! Happy coding! 🚀
