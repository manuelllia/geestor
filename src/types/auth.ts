
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
}
