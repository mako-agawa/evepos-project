'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';

const Logout = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken && !auth.isLoggedIn) {
        try {
          const res = await fetch(`${API_URL}/current_user`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setAuth({
              isLoggedIn: true,
              currentUser: userData,
            });
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
    };

    fetchCurrentUser();
  }, [API_URL, auth.isLoggedIn, setAuth]);

  const handleLogout = () => {
    // トークンを削除し、authAtomの状態をリセット
    localStorage.removeItem("token");
    setAuth({ isLoggedIn: false, currentUser: null });
    router.push("/"); // ホームページにリダイレクト
  };

  if (!auth.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">ログアウト</h1>
      <div className="py-24">
        <h1 className="text-2xl pb-8">name: {auth.currentUser.name}</h1>
        <h1 className="text-2xl pb-10">email: {auth.currentUser.email}</h1>
        <p className="text-xl pb-12 text-gray-500">※上記のアカウントでログアウトします.</p>
        <button
          onClick={handleLogout}
          className="w-full text-white bg-gray-400 hover:bg-gray-500 rounded p-3 text-xl"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}

export default Logout;
