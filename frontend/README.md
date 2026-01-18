# Angular Frontend with JWT Authentication

Modern Angular application with JWT authentication, connecting to NestJS backend.

## Installation

```bash
npm install
```

## Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

## Build

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/              # Application components
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   └── dashboard/          # Dashboard (protected)
│   ├── services/               # Services
│   │   └── auth.ts             # Authentication service
│   ├── guards/                 # Route guards
│   │   └── auth-guard.ts       # JWT authentication guard
│   ├── interceptors/           # HTTP interceptors
│   │   └── auth.interceptor.ts # JWT token interceptor
│   ├── app.config.ts           # Application configuration
│   ├── app.routes.ts           # Route definitions
│   └── app.ts                  # Root component
└── main.ts                     # Application entry point
```

## Features

### Authentication
- **Login**: User authentication with JWT tokens
- **Register**: New user registration
- **Auto-login**: Persistent authentication with localStorage
- **Logout**: Clear session and redirect to login

### Protected Routes
- Dashboard and other protected routes require authentication
- Automatic redirect to login if not authenticated
- JWT token automatically included in all HTTP requests

### Services

#### Auth Service (`services/auth.ts`)
Handles all authentication operations:
- `login(username, password)` - Authenticate user
- `register(username, email, password)` - Register new user
- `logout()` - Clear session
- `isLoggedIn()` - Check authentication status
- `currentUser` - Observable of current user

### Guards

#### Auth Guard (`guards/auth-guard.ts`)
Protects routes from unauthorized access. Redirects to login if not authenticated.

### Interceptors

#### Auth Interceptor (`interceptors/auth.interceptor.ts`)
Automatically adds JWT token to all HTTP requests in the Authorization header.

## Routes

- `/` - Redirects to login
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard (requires authentication)

## Configuration

The API URL is configured in `services/auth.ts`:
```typescript
private apiUrl = 'http://localhost:3000';
```

Update this URL if your backend runs on a different address.

## Components

### Login Component
- Username and password form
- Error handling
- Loading state
- Link to registration

### Register Component
- Username, email, and password form
- Password confirmation
- Validation
- Success message with auto-redirect

### Dashboard Component
- Displays user information
- Logout button
- Protected route example

## Styling

Each component has its own CSS file with responsive design and modern styling:
- Gradient backgrounds
- Card-based layouts
- Form validation styles
- Button states and transitions

## Development Workflow

1. Start the backend server (port 3000)
2. Start the Angular dev server (port 4200)
3. Navigate to http://localhost:4200
4. Register a new user or login
5. Access the protected dashboard

## Visual Studio Code

Recommended VS Code extensions:
- Angular Language Service
- TypeScript and JavaScript Language Features
- ESLint
- Prettier

## Production Build

```bash
ng build --configuration production
```

The production build includes:
- Ahead-of-time (AOT) compilation
- Minification
- Tree shaking
- Source maps (optional)

## Environment Configuration

For different environments (dev, staging, prod), update the API URL in the auth service or use Angular environment files.

## Security

- Passwords are never stored in plain text
- JWT tokens are stored in localStorage
- Tokens are automatically sent with HTTP requests
- Protected routes require valid authentication
- CORS is configured on the backend

## Testing

```bash
ng test
```

## Further Help

For more help on Angular CLI, use `ng help` or check the [Angular CLI Documentation](https://angular.io/cli).
