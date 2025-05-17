'use client';

import type { User } from '@/types/user'; // User型をインポート
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { authAtom, pageModeAtom } from '@/atoms/authAtom';

type AuthResponse = {
  token: string;
  user: User;
};

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const [, setPageMode] = useAtom(pageModeAtom); // ここで pageModeAtom を取得
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data: AuthResponse = await response.json();
        // console.log("Server response:", response);

        localStorage.setItem('token', data.token);
        // console.log("Saved token:", data.token);

        setAuth({
          isLoggedIn: true,
          currentUser: data.user,
          token: data.token,
        });
        setPageMode('index');
        router.replace('/'); // ログイン成功後のリダイレクト
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ログインに失敗しました');
      }
    } catch (error) {
      // console.error('Login error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    // ローカルストレージのトークン削除
    localStorage.removeItem('token');
    // console.log("Removed token");

    // Jotaiの認証状態をリセット
    setAuth({
      isLoggedIn: false,
      currentUser: null,
      token: null,
    });
    // ページモードをリセット
    setPageMode('index');
    // ページリロードによる再取得を実施
    router.replace('/');
  };

  return { auth, login, logout };
}
