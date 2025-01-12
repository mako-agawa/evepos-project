"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";

export default function Events() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [auth] = useAtom(authAtom);
  const currentUser = auth.currentUser;
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  
  useEffect(() => {
    console.log(auth);
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`, {
          headers: {
            "Content-Type": "application/json",
            ...(auth.isLoggedIn && auth.token && { Authorization: `Bearer ${auth.token}` }),
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const eventData = await res.json();
        setData(eventData);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [API_URL, auth]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-24">イベント</h1>
      <ul className="flex flex-col">
        {data.map((event) => {
          const isCreator = currentUser && event.user_id === currentUser.id;
          return (
            <Link
              href={`/${event.id}`}
              key={event.id}
              className={`text-2xl hover:cursor p-3 ${
                isCreator ? "text-orange-500" : "text-black"
              }`}
            >
              ▶︎ {event.title}___{event.date}___{event.location}
              {isCreator && <span className="ml-2 text-sm">(作成者)</span>}
            </Link>
          );
        })}
      </ul>
      {auth.isLoggedIn && (
        <Link
          href="/new"
          className="inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Create Event
        </Link>
      )}
    </div>
  );
}
