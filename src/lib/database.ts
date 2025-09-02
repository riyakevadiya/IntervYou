// Simple in-browser storage for user and session data (development only)

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In production, this should be hashed
  createdAt: string;
  lastLogin: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: string;
  role: string;
  experience: string;
  duration: string;
  focus: string[];
  score: number;
  feedback: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }>;
  duration: number;
  strengths: string[];
  improvements: string[];
  createdAt: string;
}

class DatabaseService {
  private users: User[] = [];
  private sessions: InterviewSession[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const storedUsers = localStorage.getItem('intervyou_users');
      const storedSessions = localStorage.getItem('intervyou_sessions');
      
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
      
      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.users = [];
      this.sessions = [];
    }
  }

  private saveData() {
    try {
      localStorage.setItem('intervyou_users', JSON.stringify(this.users));
      localStorage.setItem('intervyou_sessions', JSON.stringify(this.sessions));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User methods
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveData();
    return newUser;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.users.find(
      user => user.username === identifier || user.email === identifier
    ) || null;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveData();
    }
  }

  // Session methods
  async createSession(session: Omit<InterviewSession, 'id' | 'createdAt'>): Promise<InterviewSession> {
    const newSession: InterviewSession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    this.sessions.push(newSession);
    this.saveData();
    return newSession;
  }

  async getUserSessions(userId: string): Promise<InterviewSession[]> {
    return this.sessions.filter(session => session.userId === userId);
  }

  async getSessionById(sessionId: string): Promise<InterviewSession | null> {
    return this.sessions.find(session => session.id === sessionId) || null;
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    this.users = [];
    this.sessions = [];
    this.saveData();
  }

  async getStats(): Promise<{ userCount: number; sessionCount: number }> {
    return {
      userCount: this.users.length,
      sessionCount: this.sessions.length,
    };
  }
}

export const database = new DatabaseService();
