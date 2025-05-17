'use client';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { fetchAPI } from '@/utils/api';
import { authAtom } from '@/atoms/authAtom';
import type { User } from '@/types/user'; // User型をインポート

interface AuthState {
  token: string | null;
  currentUser: User | null;
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [auth, setAuth] = useAtom(authAtom);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.token) return; // トークンがない場合は何もしない
      try {
        const data: User = (await fetchAPI(`${API_URL}/current_user`, {
          headers: {
            Authorization: `Bearer ${auth.token}`, // トークンをヘッダーに追加
          },
        }));
        setCurrentUser(data);
        console.log('Fetched current user:', data);
        // 認証状態を更新（既存の値に currentUser を追加）
        setAuth((prevAuth) => ({ ...prevAuth, currentUser: data }));
      } catch (error) {
        console.error('Failed to fetch current user', error);
      }
    };

    fetchUser();
  }, [API_URL, auth.token, setAuth]); // トークンの変更時のみ実行

  const refetchUser = async () => {
    try {
      const user: User = await fetchAPI(`${API_URL}/current_user`);
      setCurrentUser(user);
    } catch (error) {
      console.error('ユーザー情報の再取得に失敗:', error);
    }
  };

  return { currentUser, refetchUser };
}
