'use client';

import type { User } from '@/types/user.type';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { authAtom, pageModeAtom } from '@/atoms/authAtom';
import { fetchAPI } from '@/utils/fetchAPI';

// 戻り値の型定義
type AuthResponse = {
  token: string;
  user: User;
};

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const [, setPageMode] = useAtom(pageModeAtom);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // 1. fetchAPIは既にデータを返すので、変数名は response ではなく data が適切
      const data = await fetchAPI<AuthResponse>('/sessions', {
        method: 'POST',
        // fetchAPI側で Content-Type は自動付与されているので、ここで書かなくてもOK（書いても問題なし）
        body: JSON.stringify({ email, password }),
      });
  
      // 2. fetchAPI内でエラーなら throw されるので、ここに来た時点で成功確定
      //    (data.token があるかどうかのチェックだけでも十分)
      if (data.token) {
         localStorage.setItem('token', data.token);
         
         setAuth({
            isLoggedIn: true,
            currentUser: data.user,
            token: data.token,
         });
         setPageMode('index');
         router.replace('/');
      }
    } catch (error) {
       console.error("Login Failed:", error);
       throw error; // UI側でエラーメッセージを表示するために再スロー
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      isLoggedIn: false,
      currentUser: null,
      token: null,
    });
    setPageMode('index');
    router.replace('/');
  };

  return { auth, login, logout };
}