import { toast } from "@/hooks/use-toast";
import { apiPost, setAuthToken } from "./api";

export interface User {
	id: string;
	username: string;
	email: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export const authService = {
	// Register a new user via backend
	register: async (username: string, email: string, password: string): Promise<User | null> => {
		if (!username || !email || !password) {
			toast({ title: "Error", description: "All fields are required", variant: "destructive" });
			return null;
		}
		if (password.length < 6) {
			toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" });
			return null;
		}
		try {
			const { data } = await apiPost<{ token: string; user: User }>("/auth/register", { username, email, password });
			setAuthToken(data.token);
			authService.setCurrentUser(data.user);
			toast({ title: "Success", description: "Account created successfully!" });
			return data.user;
		} catch (error: any) {
			toast({ title: "Error", description: error?.message || "Registration failed", variant: "destructive" });
			return null;
		}
	},

	// Login user
	login: async (username: string, password: string): Promise<User | null> => {
		if (!username || !password) {
			toast({ title: "Error", description: "Username and password are required", variant: "destructive" });
			return null;
		}
		try {
			const { data } = await apiPost<{ token: string; user: User }>("/auth/login", { username, password });
			setAuthToken(data.token);
			authService.setCurrentUser(data.user);
			toast({ title: "Success", description: `Welcome back, ${data.user.username}!` });
			return data.user;
		} catch (error: any) {
			toast({ title: "Error", description: error?.message || "Failed to login", variant: "destructive" });
			return null;
		}
	},

	// Logout user
	logout: () => {
		setAuthToken(null);
		authService.setCurrentUser(null);
		toast({ title: "Logged out", description: "You have been successfully logged out" });
	},

	// Get current user from localStorage
	getCurrentUser: (): User | null => {
		try {
			const stored = localStorage.getItem('intervyou_current_user');
			return stored ? JSON.parse(stored) : null;
		} catch (error) {
			return null;
		}
	},

	// Set current user in localStorage
	setCurrentUser: (user: User | null) => {
		try {
			if (user) {
				localStorage.setItem('intervyou_current_user', JSON.stringify(user));
			} else {
				localStorage.removeItem('intervyou_current_user');
			}
		} catch (error) {}
	},

	// Check if user is authenticated
	isAuthenticated: (): boolean => {
		return authService.getCurrentUser() !== null;
	},
};
