"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const res = await fetch(`${API_URL}/current_user`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setCurrentUser(userData); // ログイン中のユーザー情報を設定
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
    };

    fetchCurrentUser();
  }, [API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // ログアウト時にトークンを削除
    setCurrentUser(null); // currentUserをリセット
  };

  return (
    <div className="flex justify-between items-center bg-orange-400 h-20 px-24">
      <Link href="/" className="text-white text-3xl font-bold hover:cursor">いべぽす</Link>
      <div>
        {currentUser ? (
          <>
            <Link href={`/users/${currentUser.id}`} className="text-white text-xl pr-8 font-bold hover:cursor">
              {currentUser.name} さん
            </Link>
            <Link href="/users" className="text-white text-xl pr-8 font-bold hover:cursor">ユーザー管理</Link>
            <Link href="/logout" className="text-white text-xl font-bold hover:cursor">ログアウト</Link>
          </>
        ) : (
          <Link href="/sessions" className="text-white text-xl font-bold hover:cursor">ログイン</Link>
        )}
      </div>
    </div>
  );
}

export default Header;