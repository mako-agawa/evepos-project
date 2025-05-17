// authAtom.tsx
import type { AuthState } from '@/types/auth';

import { atomWithStorage } from 'jotai/utils';

export const AUTH_STORAGE_KEY = 'auth';

export const authAtom = atomWithStorage<AuthState>(AUTH_STORAGE_KEY, {
  isLoggedIn: false,
  currentUser: null,
  token: null,
});

// ページモード
export type PageMode = 'index' | 'schedule' | 'search';

export const pageModeAtom = atomWithStorage<PageMode>('pageMode', 'index');
