# OTobook SaaS Platform - Frontend

Ini adalah frontend untuk platform SaaS OTobook yang menyediakan solusi **OCR** (Optical Character Recognition) dan **RPA** (Robotic Process Automation) dengan dashboard user management yang lengkap.

## 🚀 Fitur Utama

### 1. **Landing Page** (`/`)
- Presentasi produk SaaS yang menarik
- Showcase fitur-fitur utama
- Pricing plans dengan tiga tier
- Call-to-action untuk trial gratis

### 2. **Dashboard** (`/dashboard`)
- Overview statistik real-time
- Recent activity log
- Performance metrics
- System health monitoring

### 3. **User Management** (`/dashboard/users`)
- Daftar lengkap semua user
- Search dan filter user
- Tambah/edit/hapus user
- Role management (Admin, Editor, User)
- Status tracking (Active/Inactive)

### 4. **Analytics** (`/dashboard/analytics`)
- Usage trends dengan grafik
- Usage breakdown per service
- Response time monitoring
- System health metrics
- Top services tracking

### 5. **OCR Documentation** (`/documentation/ocr`)
Dokumentasi lengkap untuk implementasi OCR di tiga platform:

#### **Web Implementation**
- Installation (Tesseract.js)
- Basic setup dengan JavaScript
- React component example
- Advanced features (PDF, multi-language, batch)

#### **Android Implementation**
- Dependency setup (ML Kit Vision)
- Permission configuration
- Java implementation
- Camera integration
- Best practices

#### **iOS Implementation**
- Framework setup (Vision framework)
- Swift implementation
- Camera integration
- Testing & optimization

### 6. **RPA Framework Documentation** (`/documentation/rpa`)
Panduan lengkap Robot Framework untuk automation:

#### **Installation Guide**
- System requirements
- Python installation
- Robot Framework setup
- Library installation
- IDE setup (RIDE)
- Project creation

#### **Robot Framework Basics**
- Test structure
- Common keywords
- Web testing examples
- Data-driven testing

#### **Advanced Techniques**
- Custom libraries (Python)
- API testing
- Database operations
- Parallel execution
- Custom reporting

#### **CI/CD Integration**
- GitHub Actions
- Jenkins Pipeline
- Docker integration
- OTobook SaaS integration

### 7. **Settings** (`/dashboard/settings`)
- Profile management
- API keys management
- Notification preferences
- Security settings (2FA, sessions, password)

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── DashboardLayout.tsx      # Dashboard layout wrapper
│   └── ui/                      # shadcn UI components
├── pages/
│   ├── Home.tsx                 # Landing page
│   ├── Dashboard.tsx            # Main dashboard
│   ├── UserManagement.tsx       # User management
│   ├── Analytics.tsx            # Analytics page
│   ├── Settings.tsx             # Settings
│   ├── OCRDocumentation.tsx     # OCR docs
│   └── RPADocumentation.tsx     # RPA docs
├── hooks/                       # Custom React hooks
├── lib/                         # Utilities
└── App.tsx                      # Main app routing
```

## 🔄 Routing Structure

```
/                           - Landing page (Home)
/dashboard                  - Main dashboard
/dashboard/users            - User management
/dashboard/analytics        - Analytics
/dashboard/settings         - Settings
/documentation/ocr          - OCR documentation
/documentation/rpa          - RPA documentation
```

## 🎨 Design & Components

Platform menggunakan:
- **React** untuk UI framework
- **shadcn/ui** untuk component library
- **Tailwind CSS** untuk styling
- **Recharts** untuk visualisasi data
- **Lucide React** untuk icons
- **React Router** untuk routing

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 atau lebih)
- npm atau bun

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Frontend

# Install dependencies
npm install
# atau
bun install

# Run development server
npm run dev
# atau
bun run dev

# Build untuk production
npm run build
# atau
bun run build
```

Server akan berjalan di `http://localhost:8080`

## 📚 Documentation Content

### OCR Documentation Includes:

**Web:**
- Tesseract.js setup
- Basic text recognition
- React component implementation
- Advanced features & best practices

**Android:**
- ML Kit Vision dependency
- Java implementation with TextRecognizer
- Camera integration dengan CameraX
- Performance optimization

**iOS:**
- Vision framework integration
- Swift code examples
- Real-time text detection
- Multi-language support

### RPA Framework Includes:

**Installation:**
- Step-by-step Python setup
- Robot Framework installation
- Essential libraries installation
- IDE setup (optional)

**Basics:**
- Test file structure
- Variable definition
- Keywords dan test cases
- Web automation examples
- Data-driven testing

**Advanced:**
- Custom Python libraries
- REST API testing
- Database operations
- Parallel test execution
- Report customization

**CI/CD Integration:**
- GitHub Actions workflow
- Jenkins pipeline configuration
- Docker containerization
- OTobook API integration

## 🔐 Security Features

- API key management dengan visibility toggle
- Session management
- Two-factor authentication (UI)
- Password management
- Security alerts

## 📊 Analytics & Monitoring

- Real-time usage tracking
- Performance metrics
- System health monitoring
- Trend analysis
- Resource utilization

## 🚀 Deployment

Frontend dapat di-deploy ke:
- Vercel
- Netlify
- AWS S3 + CloudFront
- DigitalOcean
- Docker container

## 📝 Environment Variables

Create `.env` file:

```env
VITE_API_URL=https://api.otobook.com
VITE_APP_NAME=OTobook SaaS
```

## 🤝 Contributing

Kontribusi welcome! Silakan buat pull request dengan:
1. Branch baru untuk setiap feature
2. Descriptive commit messages
3. Updated documentation

## 📄 License

MIT License - Lihat LICENSE file untuk detail.

## 📞 Support

Untuk support dan pertanyaan:
- Email: support@otobook.com
- Dokumentasi: https://docs.otobook.com
- Community Slack: https://slack.otobook.com

---

**Last Updated:** January 2024
**Version:** 1.0.0
