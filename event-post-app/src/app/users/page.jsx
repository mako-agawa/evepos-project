"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Users() {
  const [data, setData] = useState(null);  
  const [error, setError] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); // ログイン中のユーザー情報
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ログイン中のユーザー情報を取得
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
            setCurrentUser(userData); // 現在のログイン中のユーザーを設定
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
    };

    fetchCurrentUser();
  }, [API_URL]);

  // ユーザー一覧の取得
  useEffect(() => {
    const fetchUsers = async () => {
      const authToken = localStorage.getItem("authToken"); // トークンをlocalStorageから取得
      try {
        const res = await fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // トークンを設定
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setData(data);  
      } catch (error) {
        setError(error.message);  
      }
    };

    fetchUsers();
  }, [API_URL]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link href="/users/new">Create User</Link>
      <h1 className="text-4xl font-bold p-24">Hello Users</h1>
      <ul className="flex flex-col">
        {data.map((user) => {
          // ログイン中のユーザーと一致する場合はテキストカラーをオレンジにする
          const isCurrentUser = currentUser && currentUser.id === user.id;
          return (
            <Link href={`/users/${user.id}`} key={user.id}>
              <li
                className={`text-2xl hover:cursor p-3 ${
                  isCurrentUser ? "text-orange-500" : "text-black"
                }`}
              >
                ▶︎ {user.name}___{user.email}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}