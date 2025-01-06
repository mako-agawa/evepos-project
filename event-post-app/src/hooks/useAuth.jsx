'use client';

import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { authAtom } from '@/atoms/authAtom';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // 状態を更新
        setAuth({
          isLoggedIn: true,
          currentUser: data.user,
          token: data.token,
        });

        router.push('/'); // ログイン成功後のリダイレクト
      } else {
        throw new Error('ログインに失敗しました');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    // 状態をクリア
    setAuth({
      isLoggedIn: false,
      currentUser: null,
    });
    router.push('/login'); // ログアウト後のリダイレクト
  };

  return { auth, login, logout };
}