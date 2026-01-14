# SAAS Frontend + Backend Integration Guide

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│           Frontend (React + TypeScript)              │
│  Running on: http://localhost:8081                   │
│  - User Management (fetches from API)                │
│  - Dynamic Documentation (from database)             │
│  - Dashboard & Analytics                            │
└────────────────┬────────────────────────────────────┘
                 │
                 │ HTTP/REST (Axios)
                 │
┌────────────────▼────────────────────────────────────┐
│      Backend (Express.js + MySQL)                    │
│  Running on: http://localhost:3001                   │
│  - User CRUD endpoints                              │
│  - Documentation retrieval                          │
│  - Database management                              │
└────────────────┬────────────────────────────────────┘
                 │
                 │ SQL Queries
                 │
┌────────────────▼────────────────────────────────────┐
│           MySQL Database                             │
│  - users table                                      │
│  - documentation table                              │
│  - features table                                   │
└─────────────────────────────────────────────────────┘
```

## Running Both Frontend & Backend

### Terminal 1: Start Backend
```bash
cd Backend
npm start
# Server running on http://localhost:3001
```

### Terminal 2: Start Frontend
```bash
cd Frontend
npm run dev
# Server running on http://localhost:8081
```

### Terminal 3 (Optional): Seed Data
```bash
# Seed demo users
curl -X POST http://localhost:3001/api/users/seed-demo

# Seed documentation
curl -X POST http://localhost:3001/api/documentation/seed
```

## Frontend Configuration

**File: `.env.local` in Frontend folder**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=OTobook SaaS
```

## API Integration Points

### 1. User Management Page
- **Fetches:** `GET /api/users`
- **Creates:** `POST /api/users`
- **Updates:** `PUT /api/users/:id`
- **Deletes:** `DELETE /api/users/:id`
- **Stats:** `GET /api/users/stats`

### 2. Home Page (Landing)
- **Fetches:** `GET /api/documentation`
- **Displays:** Dynamic documentation cards from database
- **Shows:** OCR and RPA documentation entries

### 3. Dashboard
- **Fetches:** `GET /api/users/stats`
- **Displays:** User statistics and metrics

## Dynamic Documentation Flow

1. **Database Storage** (MySQL)
   - All documentation stored in `documentation` table
   - Supports OCR and RPA types
   - Has platform-specific data

2. **API Retrieval** (Backend)
   - `/api/documentation` - Get all docs
   - `/api/documentation/OCR` - Get OCR docs
   - `/api/documentation/RPA` - Get RPA docs

3. **Frontend Display** (React)
   - Home page fetches docs on mount
   - Displays cards for each documentation entry
   - Links to detailed pages (OCRDocumentation.tsx, RPADocumentation.tsx)

## File Structure

```
SAAS Otobook/
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx          (Dynamic docs display)
│   │   │   ├── UserManagement.tsx (API integration)
│   │   │   ├── Dashboard.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── api.ts            (Axios client)
│   │   └── ...
│   ├── .env.local                 (API configuration)
│   └── package.json
│
└── Backend/
    ├── config/
    │   └── database.js            (MySQL setup)
    ├── controllers/
    │   ├── userController.js
    │   └── documentationController.js
    ├── routes/
    │   ├── users.js
    │   └── documentation.js
    ├── server.js                  (Express setup)
    ├── .env                       (Database config)
    └── package.json
```

## Key Files Modified

### Frontend

**src/lib/api.ts** - API client setup
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  createUser: (data) => apiClient.post('/users', data),
  // ... more methods
};

export const documentationAPI = {
  getAllDocumentation: () => apiClient.get('/documentation'),
  // ... more methods
};
```

**src/pages/Home.tsx** - Dynamic documentation
```typescript
const [docs, setDocs] = useState<Doc[]>([]);

useEffect(() => {
  documentationAPI.getAllDocumentation()
    .then(res => setDocs(res.data.data));
}, []);

// Display docs in grid
{docs.filter(d => d.type === 'OCR').map(doc => (
  <Card key={doc.id}>{doc.title}</Card>
))}
```

**src/pages/UserManagement.tsx** - API integration
```typescript
const fetchUsers = async () => {
  const response = await userAPI.getAllUsers();
  setUsers(response.data.data);
};

const handleDeleteUser = async (id) => {
  await userAPI.deleteUser(id);
  fetchUsers(); // Refresh from API
};
```

### Backend

**config/database.js** - Database connection
**controllers/userController.js** - User operations
**controllers/documentationController.js** - Documentation operations
**routes/users.js** - User endpoints
**routes/documentation.js** - Documentation endpoints

## Testing the Integration

### 1. Verify Backend is Running
```bash
curl http://localhost:3001/health
```

### 2. Get All Users
```bash
curl http://localhost:3001/api/users | python3 -m json.tool
```

### 3. Get Documentation
```bash
curl http://localhost:3001/api/documentation | python3 -m json.tool
```

### 4. Open Frontend
- Navigate to: http://localhost:8081
- Check Home page - should show documentation cards
- Go to Dashboard → User Management - should show users from database
- Try adding/deleting users - should persist in database

## Troubleshooting

### Frontend can't connect to backend
- Check backend is running on port 3001
- Check .env.local has correct VITE_API_BASE_URL
- Check browser console for CORS errors
- Ensure backend has `cors()` middleware enabled

### Users not showing on page
- Check network tab in DevTools
- Verify API response: `curl http://localhost:3001/api/users`
- Check browser console for errors

### Documentation not showing
- Seed data: `curl -X POST http://localhost:3001/api/documentation/seed`
- Check API: `curl http://localhost:3001/api/documentation`

### Database errors
- Check MySQL is running
- Verify .env credentials
- Check database exists: `mysql -u root -e "SHOW DATABASES;"`

## Next Steps

1. ✅ Backend API created
2. ✅ Frontend API integration done
3. ✅ User Management connected to database
4. ✅ Dynamic documentation on home page
5. 🔄 Add authentication/JWT tokens
6. 🔄 Implement form validation
7. 🔄 Add real-time updates (WebSocket)
8. 🔄 Setup automated testing
9. 🔄 Deploy to production (Vercel/Heroku)

## Default Demo Credentials

When demo data is seeded:
- **Email:** john@otobook.com
- **Password:** demo123 (use for frontend login)

## Support

For issues or questions:
- Check backend logs in terminal
- Check frontend console (F12)
- Review MySQL error logs
- Check .env files are properly configured
