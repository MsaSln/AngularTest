# Angular + NestJS + MSSQL JWT Authentication Project

Modern web application using Angular for the frontend, NestJS for the backend, MSSQL for the database, and JWT for authentication.

## Project Structure

```
AngularTest/
├── backend/          # NestJS backend with JWT authentication
├── frontend/         # Angular frontend application
└── README.md         # This file
```

## Technologies

- **Frontend**: Angular 19+
- **Backend**: NestJS
- **Database**: Microsoft SQL Server (MSSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Microsoft SQL Server (local or remote)
- Visual Studio Code (recommended)

## Quick Start

### 1. Database Setup

Make sure you have MSSQL running. Default configuration in `backend/.env`:
- Host: localhost
- Port: 1433
- Username: sa
- Password: YourStrong@Password
- Database: testdb

Update the `.env` file in the backend folder with your actual database credentials.

### 2. Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:4200`

## Features

### Backend (NestJS)
- JWT-based authentication
- User registration and login
- Protected routes with JWT guards
- TypeORM integration with MSSQL
- Password hashing with bcrypt
- CORS enabled for Angular frontend

### Frontend (Angular)
- Login and registration forms
- JWT token management
- HTTP interceptor for automatic token injection
- Route guards for protected pages
- Dashboard with user information
- Responsive design

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login user
  ```json
  {
    "username": "john",
    "password": "password123"
  }
  ```

### Users (Protected)
- `GET /users/profile` - Get current user profile (requires JWT token)
- `GET /users` - Get all users (requires JWT token)

## Development

### Backend Development
```bash
cd backend
npm run start:dev    # Start with hot reload
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Frontend Development
```bash
cd frontend
ng serve            # Start development server
ng build            # Build for production
ng test             # Run tests
```

## Visual Studio Code

This project is fully compatible with Visual Studio Code. Recommended extensions:
- Angular Language Service
- TypeScript and JavaScript Language Features
- ESLint
- Prettier

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrong@Password
DB_DATABASE=testdb

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=3600

PORT=3000
```

## Security Notes

- Change the `JWT_SECRET` in production
- Use strong database passwords
- Set `synchronize: false` in TypeORM for production
- Enable HTTPS in production
- Implement rate limiting for authentication endpoints

## License

MIT
