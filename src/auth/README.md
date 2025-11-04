# Auth Module

Authentication module for handling user signup, login, and JWT-based authentication.

## Features

- **User Signup**: Create new user accounts with email validation and password hashing
- **User Login**: Authenticate users with email and password
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Protected Routes**: Guard routes with JWT authentication
- **Password Security**: Passwords hashed using bcrypt with salt rounds of 10

## Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /auth/login
Authenticate a user and receive an access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### GET /auth/profile
Get the authenticated user's profile (requires JWT token).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "1234567890",
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Usage

### Protecting Routes

To protect routes in other modules, use the `JwtAuthGuard`:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
```

### Accessing User in Controllers

```typescript
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Request() req) {
    return req.user; // Contains: { id, email, name }
  }
}
```

## Configuration

Set the JWT secret in your `.env` file:

```
JWT_SECRET=your-super-secret-key-here
```

Token expiration is set to 24 hours by default. Modify in `auth.module.ts`:

```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '24h' }, // Change this value
}),
```

## Current Implementation Note

⚠️ **In-Memory Storage**: The current implementation uses in-memory storage for users. This is for demonstration purposes only.

For production use, replace the in-memory storage with a database (Prisma/TypeORM):

1. Create a User entity/model
2. Inject the repository/service into `AuthService`
3. Replace `this.users` array operations with database queries

## Security Considerations

- Always use a strong JWT secret in production
- Store JWT secret in environment variables, never in code
- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 24 hours
- Consider implementing refresh tokens for better UX
- Add rate limiting to prevent brute force attacks
- Implement email verification for signups
