# OTobook SaaS - Digital Library Automation Platform

A modern SaaS platform for automated book cataloging and robotic process automation built with React, Express, and MySQL.

## 🚀 Features

### Public Documentation
- **OCR Documentation** - Web, Android, iOS, and Flutter implementations for optical character recognition
- **RPA Documentation** - Robot Framework guides with installation, basics, advanced techniques, and CI/CD integration

### Protected Features (Authentication Required)
- **Dashboard** - Main application dashboard with statistics and recent activity
- **User Management** - Full CRUD operations for user administration
- **Analytics** - Application analytics and reporting
- **Settings** - User and application settings

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router v6** - Client-side routing

### Backend
- **Express.js** - Server framework
- **Node.js** - Runtime
- **MySQL** - Database
- **dotenv** - Environment configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- MySQL Server

## 🚀 Getting Started

### Option A: Docker (Recommended)

#### Quick Start
```bash
git clone https://github.com/D4marp/Saas_Otobook-Digital-library.git
cd "SAAS Otobook"
docker-compose up -d
```

Then access:
- **Frontend**: http://localhost
- **Backend**: http://localhost:3001
- **MySQL**: localhost:3306

For detailed Docker setup, see [DOCKER.md](./DOCKER.md)

### Option B: Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/D4marp/Saas_Otobook-Digital-library.git
cd "SAAS Otobook"
```

#### 2. Setup Backend
```bash
cd Backend
npm install
# Configure .env file with MySQL credentials
npm start
# Backend runs on http://localhost:3001
```

#### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
# Frontend runs on http://localhost:8080
```

## 📚 Project Structure

```
SAAS Otobook/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── server.js
│   └── .env
└── Frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── lib/
    │   └── App.tsx
    └── vite.config.ts
```

## 🔐 Authentication

- Public routes: `/`, `/documentation/ocr`, `/documentation/rpa`, `/login`, `/signup`
- Protected routes: `/dashboard`, `/dashboard/users`, `/dashboard/analytics`, `/dashboard/settings`
- Authentication via localStorage tokens

## 📖 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

### Documentation
- `GET /api/documentation` - Get all documentation
- `GET /api/documentation/type/:type` - Get documentation by type (OCR/RPA)

## 🎨 UI Components

Built with shadcn/ui for a professional, modern interface:
- Cards
- Tabs
- Buttons
- Forms
- Tables
- Progress bars
- And more...

## 📱 Platform Support

- **Web** - React web application
- **Mobile** - iOS and Android guides via Flutter and native implementations
- **RPA** - Robot Framework automation scripts

## 🔧 Configuration

### Backend (.env)
```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=otobook_saas
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🌟 Key Features

✅ Modern, professional dashboard
✅ Complete documentation with code examples
✅ Flutter hybrid platform support
✅ Protected routes and authentication
✅ Responsive design for all devices
✅ Real-time data fetching from MySQL
✅ Copy-to-clipboard code snippets
✅ Dark-themed code blocks

## 📝 Demo Accounts

The application comes with 5 demo users:
- John Doe (Admin)
- Jane Smith (Editor)
- Bob Johnson (User)
- Alice Williams (Editor)
- Charlie Brown (User)

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

D4marp - Digital Library Automation Developer

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please reach out through GitHub issues.
