import { atomWithStorage } from 'jotai/utils';

export const AUTH_STORAGE_KEY = "auth";

// 認証状態を管理するアトム
export const authAtom = atomWithStorage(AUTH_STORAGE_KEY, {
  isLoggedIn: false,
  currentUser: null,
  token: null,
});
