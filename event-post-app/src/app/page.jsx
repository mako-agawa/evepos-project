"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';

export default function Events() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useCurrentUser();
  const [auth] = useAtom(authAtom);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/events`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const eventData = await res.json();
        setData(eventData);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, [API_URL]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-24">イベント</h1>
      <ul className="flex flex-col">
        {data.map((event) => {
          // イベントの作成者がcurrentUserと一致するかチェック
          const isCreator = currentUser && event.user_id === currentUser.id;
          
          return (
            <Link 
              href={`/events/${event.id}`} 
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
          href="/events/new"
          className="inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Create Event
        </Link>
      )}
    </div>
  );
}