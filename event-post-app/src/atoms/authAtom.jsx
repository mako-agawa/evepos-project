// atoms/authAtom.js
import { atomWithStorage } from "jotai/utils";

// localStorageのキーを統一
export const AUTH_STORAGE_KEY = "auth";
export const TOKEN_STORAGE_KEY = "token";

export const authAtom = atomWithStorage(AUTH_STORAGE_KEY, {
  isLoggedIn: false,
  currentUser: null,
});