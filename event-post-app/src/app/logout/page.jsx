'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

const Logout = () => {
  const { auth, logout } = useAuth(); // フックを使用

  if (!auth.isLoggedIn) {
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
        <h1 className="text-2xl pb-8">name: {auth.currentUser.name}</h1>
        <h1 className="text-2xl pb-10">email: {auth.currentUser.email}</h1>
        <p className="text-xl pb-12 text-gray-500">※上記のアカウントでログアウトします.</p>
        <button
          onClick={logout} // フックからの関数を呼び出し
          className="w-full text-white bg-gray-400 hover:bg-gray-500 rounded p-3 text-xl"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Logout;
