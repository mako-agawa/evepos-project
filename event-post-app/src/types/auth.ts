// types/auth.ts
import type { User } from '@/types/user';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  token: string | null;
}
