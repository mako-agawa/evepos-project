"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { authState } from "@/atoms/authState";

const Header = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [auth, setAuth] = useRecoilState(authState);

  const handleLogin = () => {
    // サンプルユーザーを仮のログインデータとしてセット
    const user = { id: 1, name: "makoto" };
    setAuth({
      isLoggedIn: true,
      currentUser: user,
    });
    localStorage.setItem("authToken", "dummy-token"); // 仮のトークンをローカルストレージにセット
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken && !auth.isLoggedIn) { // すでにログインしているかどうかを確認
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

  return (
    <div className="flex justify-between items-center bg-orange-400 h-20 px-24">
      <Link href="/" className="text-white text-3xl font-bold hover:cursor">いべぽす</Link>
      <div>
        {auth.isLoggedIn ? (
          <>
            <Link href={`/users/${auth.currentUser.id}`} className="text-white text-xl pr-8 font-bold hover:cursor">
              {auth.currentUser.name} さん
            </Link>
            <Link href="/users" className="text-white text-xl pr-8 font-bold hover:cursor">ユーザー管理</Link>
            <Link href="/logout" className="text-white text-xl font-bold hover:cursor">ログアウト</Link>
          </>
        ) : (
          <Link href="/sessions" className="text-white text-xl font-bold hover:cursor">ログイン</Link>
        )}
      </div>
      {!auth.isLoggedIn && (
        <div>
          <button onClick={handleLogin} className="text-white text-xl font-bold hover:cursor">Login</button>
        </div>
      )}
    </div>
  );
};

export default Header;