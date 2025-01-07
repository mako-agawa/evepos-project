import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

export const AUTH_STORAGE_KEY = "auth";
export const TOKEN_STORAGE_KEY = "token";

// 認証状態を管理するアトム
export const authAtom = atomWithStorage(AUTH_STORAGE_KEY, {
  isLoggedIn: false,
  currentUser: null,
  token: null,
});
