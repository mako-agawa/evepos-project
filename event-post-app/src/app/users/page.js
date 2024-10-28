"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Users() {
  const [data, setData] = useState(null);  
  const [error, setError] = useState(null); 
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
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
        {data.map((user) => (
          <Link href={`/users/${user.id}`} key={user.id} className="text-2xl hover:cursor p-3">
            ▶︎ {user.name}___{user.email}
          </Link> 
        ))}
      </ul>
    </div>
  );
}