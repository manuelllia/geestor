
export interface User {
  uid: string;
  email: string | null;
  name: string;
  profilePicture?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying: boolean;
}
