import { atom } from 'recoil';

export const authState = atom({
  key: 'authState',  // 一意なキー
  default: {
    isLoggedIn: false,
    currentUser: null,
  },
});