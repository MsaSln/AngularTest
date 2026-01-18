# NestJS Backend with JWT Authentication

Backend API built with NestJS, TypeORM, and MSSQL with JWT authentication.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the backend directory:

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

## Running the Application

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── auth/                  # Authentication module
│   ├── auth.controller.ts # Login/register endpoints
│   ├── auth.service.ts    # Authentication logic
│   ├── auth.module.ts     # Auth module configuration
│   ├── jwt.strategy.ts    # JWT strategy for Passport
│   └── jwt-auth.guard.ts  # JWT guard for protected routes
├── users/                 # Users module
│   ├── user.entity.ts     # User database entity
│   ├── users.service.ts   # User CRUD operations
│   ├── users.controller.ts# User endpoints
│   └── users.module.ts    # Users module configuration
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user

**Request:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST /auth/login
Login and receive JWT token

**Request:**
```json
{
  "username": "john",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

### Users (Protected Routes)

#### GET /users/profile
Get current user profile (requires JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /users
Get all users (requires JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

## Database

The application uses TypeORM with MSSQL. The database schema is automatically synchronized on application start (in development mode).

### User Entity
- `id`: Primary key (auto-increment)
- `username`: Unique username
- `email`: Unique email
- `password`: Hashed password (bcrypt)
- `isActive`: User status (default: true)
- `createdAt`: Timestamp of creation

## Development

The application uses hot reload in development mode. Any changes to the source files will automatically restart the server.

```bash
npm run start:dev
```

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```

The compiled files will be in the `dist` directory.

## Running in Production

```bash
npm run start:prod
```

Make sure to:
1. Set `synchronize: false` in TypeORM configuration
2. Use a strong `JWT_SECRET`
3. Use production database credentials
4. Enable HTTPS
5. Implement rate limiting
