import type { User } from '@/types/user.type';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  token: string | null;
}
