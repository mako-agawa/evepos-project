"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";  // 新しく追加

// 非同期の params を unwrap する
export default function UserShow({ params }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const { id } = use(params);  // params を unwrap

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [id, API_URL]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-24">User Details</h1>
      <div className="text-2xl">
        <p>Name: {data.name}</p>
        <p className="pb-12">Email: {data.email}</p>
        <Link href="/users" className="text-green-700">back to Users</Link>
      </div>
    </div>
  );
}