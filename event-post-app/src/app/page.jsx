"use client"
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilValue } from 'recoil';
import { authState } from "@/atoms/authState"; 


export default function Events() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  const auth = useRecoilValue(authState)  
  // const { auth, login, logout } = useAuth();

  const handleLogin = () => {
    const user = { id: 1, name: 'makoto' }; // ユーザー情報
    login(user);
  };

  useEffect(() => {
    const fetchEvnets = async () => {
      try {
        const res = await fetch(`${API_URL}/events`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvnets();
  }, [API_URL]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-24">Hello Events</h1>
      <ul className="flex flex-col">
        {data.map((event) => (
          <Link href={`/${event.id}`} key={event.id} className="text-2xl hover:cursor p-3">
            ▶︎ {event.title}___{event.date}___{event.location}
          </Link>
        ))}
      </ul>
      <Link
        href="/new"
        className="inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Event Create
      </Link>

      <h1 className="text-4xl font-bold pt-24 pb-12">Recoil Output</h1>
      {auth.isLoggedIn ? (
        <div>
        aaa
          {/* <p>Logged in as: {auth.currentUser.name}</p> */}
          {/* <button onClick={logout}>Logout</button> */}
        </div>
      ) : (
        <div>bbb
        {/* <button onClick={handleLogin}>Login</button> */}
        </div>
      )}
        <p className="text-xl font-bold">coming soon</p>
    </div>
  );
}