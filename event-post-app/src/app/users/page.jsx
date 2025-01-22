'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";


export default function Users() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { auth } = useAuth(); // フックを使用
  console.log(auth);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const userList = await res.json();
        setData(userList);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch users:', error);
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
      <h1 className="text-4xl font-bold p-24">ユーザー管理</h1>
      <ul className="flex flex-col">
        {data.map((user) => {
          const isCurrentUser = auth.currentUser && auth.currentUser.id === user.id;
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
      <Link 
        href="/users/new" 
        className="inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Create User
      </Link>
    </div>
  );
}
