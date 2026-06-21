# Urban Vogue

A modern e-commerce application built with NestJS (backend) and React (frontend), featuring authentication, refresh tokens, and role-based access control (RBAC).

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Email**: Nodemailer with Ethereal Email (for testing)
- **Validation**: class-validator
- **API Documentation**: Swagger

### Frontend
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistence
- **HTTP Client**: Axios
- **Routing**: React Router
- **UI Components**: Custom components with shadcn/ui patterns
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mhd-ashmal38/Urban-Vogue.git
cd Urban-Vogue
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npx prisma migrate dev

# Seed the database (creates admin user)
npx ts-node prisma/seed.ts

# Start the backend server
npm run start:dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation (Swagger)**: http://localhost:3000/api
- **Prisma Studio (Database GUI)**: Run `npx prisma studio` in the backend directory

## Test Credentials

### Admin User

Use these credentials to access the admin dashboard:

```
Email: admin@urbanvogue.com
Password: Admin123!
Role: ADMIN
```

### Test User

Use these credentials to test regular user functionality:

```
Email: test@example.com
Password: password123
Role: USER
```

> **Note**: The test user needs to be registered first. You can register a new user via the registration form, or use the seed script to create additional test users.

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/urban_vogue"

# JWT
JWT_SECRET="your-super-secret-key-change-this-in-production"
JWT_EXPIRES_IN="15m"

# Email (Ethereal for testing)
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT="587"
EMAIL_USER="your-ethereal-email"
EMAIL_PASSWORD="your-ethereal-password"
EMAIL_FROM="Urban Vogue <noreply@urbanvogue.com>"

# Frontend URL (for password reset links)
FRONTEND_URL="http://localhost:5173"
```

## Features

### Authentication
- User registration with email validation
- User login with JWT tokens
- Password reset via email
- **Refresh tokens** for seamless session management
- Automatic token refresh on 401 errors
- Secure logout (invalidates refresh token)

### Role-Based Access Control (RBAC)
- **USER role**: Can browse, add to cart, checkout, view own profile
- **ADMIN role**: Full access to admin dashboard and management features
- Role-based routing (admin users redirected to admin dashboard)
- Protected routes and API endpoints
- Backend guard enforcement

### Security
- Password hashing with bcrypt
- JWT access tokens (15 min expiry)
- Refresh tokens (7 day expiry) with token rotation
- RBAC with backend guard enforcement
- Protected routes on frontend
- Email enumeration prevention

## Project Structure

```
Urban-Vogue/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   ├── strategies/
│   │   │   ├── decorators/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   ├── email/
│   │   └── common/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.tsx
│   └── .env
├── RBAC_GUIDE.md
├── REFRESH_TOKEN_GUIDE.md
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/profile` | Get current user profile | Yes |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| GET | `/auth/admin-only` | Admin-only endpoint (example) | Yes (ADMIN) |

## Documentation

- **[RBAC Guide](./RBAC_GUIDE.md)** - Complete guide to Role-Based Access Control implementation
- **[Refresh Token Guide](./REFRESH_TOKEN_GUIDE.md)** - Complete guide to refresh token functionality

## Development

### Running Tests

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### Code Formatting

```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Linting

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Database Management

### View Database

```bash
cd backend
npx prisma studio
```

### Reset Database

```bash
cd backend
npx prisma migrate reset
```

### Create New Migration

```bash
cd backend
npx prisma migrate dev --name migration_name
```

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Run `npx prisma generate` after schema changes

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check CORS configuration in backend
- Verify API base URL in frontend services

### Email not sending
- Check Ethereal credentials in .env
- Verify EMAIL_HOST and EMAIL_PORT
- Check backend logs for email errors

### Refresh token errors
- Ensure Prisma migrations are applied
- Check that refreshToken and refreshTokenExpiry fields exist in database
- Verify JWT_SECRET is set

### RBAC not working
- Ensure user has correct role in database
- Check that RolesGuard is applied to endpoints
- Verify frontend hasRole() helper is working
- Restart backend after Prisma schema changes

## License

This project is for educational purposes.

## Contributing

This is a learning project. Feel free to fork and modify for your own use.
