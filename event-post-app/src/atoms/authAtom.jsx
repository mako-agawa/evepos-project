import { atom } from 'jotai';

export const authAtom = atom({
  isLoggedIn: false,
  currentUser: null,
});