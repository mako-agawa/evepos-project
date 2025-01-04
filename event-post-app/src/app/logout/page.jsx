'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Logout = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const { currentUser, isLoggedIn } = useCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // トークン削除
    setAuth({ isLoggedIn: false, currentUser: null }); // 状態リセット
    router.push('/'); // ホームページにリダイレクト
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold">ログアウト</h1>
      <div className="py-24">
        <h1 className="text-2xl pb-8">name: {currentUser.name}</h1>
        <h1 className="text-2xl pb-10">email: {currentUser.email}</h1>
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
};

export default Logout;
