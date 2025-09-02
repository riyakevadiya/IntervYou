# 🎯 IntervYou - AI-Powered Interview Preparation Platform

> **Master your next interview with AI-powered practice sessions, real-time feedback, and personalized coaching.**

## ✨ Features

### 🔐 **Authentication System**
- **User Registration & Login** - Secure account creation with email/username
- **Session Management** - Persistent login state across browser sessions
- **User Profiles** - Personalized dashboard with interview history
- **Database Storage** - Local storage (no external database configured yet)

### 🎤 **AI Interview Practice**
- **Real-time AI Interviewer** - Dynamic question generation based on role and experience
- **Multiple Interview Types** - Technical, Behavioral, System Design, and more
- **Customizable Sessions** - Set duration, focus areas, and difficulty levels
- **Instant Feedback** - Get scores and improvement suggestions immediately

### 📊 **Analytics & Progress**
- **Performance Tracking** - Monitor your interview skills over time
- **Detailed Analytics** - View strengths, weaknesses, and improvement areas
- **Interview History** - Review past sessions and feedback
- **Progress Dashboard** - Visual representation of your growth

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Beautiful themes with smooth transitions
- **Accessible Interface** - WCAG compliant with keyboard navigation
- **Smooth Animations** - Engaging micro-interactions and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your_repo_url>
   cd intervyou
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library

### **State Management**
- **React Context** - Authentication and app state management
- **React Query** - Server state management and caching

### **Authentication**
- **Custom Auth System** - Secure user registration and login
- **Local Storage** - Session persistence (easily replaceable with real DB)
- **Form Validation** - Comprehensive input validation and error handling

### **Database**
- **Local Storage** - Development-only storage
- **Interview Sessions** - Complete interview data storage
- **User Profiles** - User data and preferences management

## 📁 Project Structure

```
intervyou/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── AuthDialog.tsx  # Authentication modal
│   │   ├── Header.tsx      # Navigation header
│   │   ├── HeroSection.tsx # Landing page hero
│   │   └── ...             # Other components
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.tsx     # Authentication hook
│   ├── lib/                # Utility libraries
│   │   ├── auth.ts         # Authentication service
│   │   ├── database.ts     # Database operations
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   └── assets/             # Static assets
├── public/                 # Public assets
└── README.md              # This file
```

## 🎯 Usage

### For Job Seekers
1. **Create Account** - Sign up with email and password
2. **Choose Interview Type** - Select your target role and experience level
3. **Practice Sessions** - Answer AI-generated questions in real-time
4. **Review Feedback** - Get detailed analysis and improvement suggestions
5. **Track Progress** - Monitor your performance over time

### For Developers
The codebase is well-documented and follows React best practices:

```tsx
// Example: Using authentication in components
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <AuthDialog />;
  }
  
  return <div>Welcome, {user?.username}!</div>;
};
```

## 🚀 Deployment

Deployment is not configured yet. Current focus is local development. Build locally with:
```bash
npm run build
```

## 📚 Documentation

- **Authentication Guide**: [AUTHENTICATION_README.md](AUTHENTICATION_README.md)
- **API Documentation**: See `src/lib/` for service implementations
- **Component Library**: See `src/components/ui/` for reusable components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** - Beautiful component library
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

---

<div align="center">
  <p>Made with ❤️ <a href="https://github.com/malayraval05"> </a></p>
  <p>If this project helps you, please give it a ⭐️</p>
</div>

## Backend (Express + MongoDB)

A simple Node/Express backend with MongoDB (Mongoose) lives in `server/`.

### Prerequisites
- Node 18+
- MongoDB running locally or a MongoDB Atlas URI

### Setup

1. Create a `.env` file in `server/` with:
```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/intervyou
JWT_SECRET=please-change-me
CORS_ORIGIN=http://localhost:5173
```

2. Install and run the backend:
```
cd server
npm install
npm run dev
```
API will be available at `http://localhost:4000/api`.

3. Frontend expects `VITE_API_URL` to point to the backend:
```
# .env (project root)
VITE_API_URL=http://localhost:4000/api
```

### API Overview
- POST `/api/auth/register` { username, email, password }
- POST `/api/auth/login` { username, password }
- GET `/api/auth/me` (Bearer token)
- POST `/api/sessions` (Bearer token) save interview result
- GET `/api/sessions` (Bearer token) list sessions
- GET `/api/sessions/:id` (Bearer token) get session by id
- DELETE `/api/sessions/:id` (Bearer token)
