// hooks/useCurrentUser.js
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { authAtom, AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/atoms/authAtom';

export function useCurrentUser() {
  const [auth, setAuth] = useAtom(authAtom);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // トークンの確認
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        
        if (!token) {
          // トークンがない場合は未認証状態に
          setAuth({ isLoggedIn: false, currentUser: null });
          return;
        }

        // 既に認証情報がある場合はスキップ
        if (auth.isLoggedIn && auth.currentUser) {
          return;
        }

        const res = await fetch(`${API_URL}/current_user`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (res.ok) {
          const userData = await res.json();
          const newAuth = {
            isLoggedIn: true,
            currentUser: userData
          };
          setAuth(newAuth);
        } else {
          // 認証エラーの場合
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setAuth({ isLoggedIn: false, currentUser: null });
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuth({ isLoggedIn: false, currentUser: null });
      }
    };

    fetchCurrentUser();
  }, [API_URL, setAuth, auth.isLoggedIn]);

  return { currentUser: auth.currentUser, isLoggedIn: auth.isLoggedIn };
}