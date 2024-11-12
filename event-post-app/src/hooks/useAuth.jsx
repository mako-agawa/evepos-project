
// hooks/useAuth.js
"use client"; // クライアントサイドでのみ使用

import { useRecoilState } from 'recoil';
import { authState } from '../atoms/authState'; 

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const login = (user) => {
    setAuth({
      isLoggedIn: true,
      currentUser: user,
    });
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      currentUser: null,
    });
  };

  return { auth, login, logout };
};