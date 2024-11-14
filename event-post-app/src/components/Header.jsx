'use client';

import { useEffect } from "react";
import Link from "next/link";
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';



const Header = () => {
  const [auth, setAuth] = useAtom(authAtom);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;



  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("token");
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

  }, [auth.isLoggedIn, setAuth, API_URL]);

  return (
    <div className="flex justify-between items-center bg-orange-400 h-20 px-24">
      <Link href="/" className="text-white text-3xl font-bold hover:cursor">いべぽす</Link>
      <div>
        {auth.isLoggedIn && auth.currentUser ? (
          <>
            <Link href={`/users/${auth.currentUser.id}`} className="text-white text-xl pr-8 font-bold hover:cursor">
              {auth.currentUser.name} さん
            </Link>
            <Link href="/users" className="text-white text-xl pr-8 font-bold hover:cursor">ユーザー管理</Link>
            <Link href="/logout" className="text-white text-xl pr-8 font-bold hover:cursor">ログアウト</Link>
          </>
        ) : (
          <Link href="/login" className="text-white text-xl font-bold hover:cursor">ログイン</Link>
        )}
      </div>
    </div>
  );
};

export default Header;