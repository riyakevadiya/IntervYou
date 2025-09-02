# Authentication System for IntervYou

This project now includes a complete authentication system with user registration, login, and session management.

## Features

- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Sign in with username/email and password
- **Session Management**: Automatic login state persistence
- **User Profile**: Display user information in the header
- **Logout**: Secure logout functionality
- **Database Storage**: User data is stored locally (easily replaceable with real database)

## How It Works

### 1. Authentication Flow

1. **Unauthenticated Users**: See "Sign In" and "Get Started" buttons
2. **Sign In**: Opens login dialog with username/email and password fields
3. **Get Started**: Opens registration dialog to create a new account
4. **Authenticated Users**: See their username in the header with a dropdown menu

### 2. Database Storage

The system uses a simple localStorage-based store for development. No external database is configured at this stage.

### 3. Security Features

- Password validation (minimum 6 characters)
- Username/email uniqueness validation
- Session persistence across browser sessions
- Form validation and error handling

## File Structure

```
src/
├── lib/
│   ├── auth.ts          # Authentication service
│   └── database.ts      # Database operations
├── hooks/
│   └── useAuth.tsx      # React authentication hook
├── components/
│   ├── AuthDialog.tsx   # Login/Register dialog
│   ├── Header.tsx       # Updated with auth UI
│   └── HeroSection.tsx  # Updated with auth integration
└── App.tsx              # Wrapped with AuthProvider
```

## Usage

### For Users

1. **Register**: Click "Get Started" and fill in your details
2. **Login**: Click "Sign In" and enter your credentials
3. **Start Interview**: Once logged in, you can start practicing interviews
4. **Logout**: Click your username in the header and select "Log out"

### For Developers

#### Adding Authentication to Components

```tsx
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in to access this feature</div>;
  }
  
  return <div>Welcome, {user?.username}!</div>;
};
```

#### Protecting Routes

```tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <AuthDialog />;
  }
  
  return <>{children}</>;
};
```

#### Replacing with Real Database (Future Work)

In a future milestone, you can integrate a real backend/database. For now, keep logic in `src/lib/database.ts`.

## Testing the System

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Create a new account**:
   - Click "Get Started"
   - Fill in username, email, and password
   - Click "Create Account"

3. **Test login**:
   - Click "Sign In"
   - Enter your credentials
   - Verify you're logged in

4. **Test logout**:
   - Click your username in the header
   - Select "Log out"
   - Verify you're logged out

## Data Storage

User data is stored in browser localStorage:
- `intervyou_users`: Array of user objects
- `intervyou_current_user`: Currently logged-in user
- `intervyou_sessions`: Interview session data

## Security Notes

⚠️ **Important**: This is a demo implementation. For production:

1. **Hash passwords** using bcrypt or similar
2. **Use HTTPS** for all communications
3. **Implement JWT tokens** for session management
4. **Add rate limiting** to prevent brute force attacks
5. **Use a real database** instead of localStorage
6. **Add email verification** for new accounts
7. **Implement password reset** functionality

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Interview history per user
- [ ] Progress tracking
- [ ] Admin panel for user management
