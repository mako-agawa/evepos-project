import Image from 'next/image';
import React from 'react';
import { useEffect, useState } from "react";

import { fetchAPI } from "@/utils/api";
import { useAtom } from "jotai";
import { authAtom } from '@/atoms/authAtom';
import { useRouter } from "next/navigation";

// propsとして events を受け取る
const EventSchedule = () => {
  const [auth] = useAtom(authAtom);
  const router = useRouter();
  const currentUser = auth.currentUser;
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await fetchAPI(`${API_URL}/events/schedule`);
        setEvents(eventData);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, [API_URL]);

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  if (!events.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen gap-6 w-full max-w-3xl px-4">
      <h1 className="text-4xl text-gray-800 font-bold p-8">スケジュール</h1>
      {events.map((event) => {
        const isCreator = currentUser && event.user_id === currentUser.id;
        return (
          <div
            key={event.id}
            onClick={() => router.push(`/${event.id}`)}
            className="cursor-pointer flex items-center gap-6 p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Image src={event.image_url} alt={event.title} width={96} height={96} priority className="object-cover rounded-md" />
            <div>
              <h2 className={`text-2xl font-semibold ${isCreator ? 'text-orange-500' : 'text-black'}`}>
                {event.title}
              </h2>
              <p className="text-gray-600 mt-1">📅 {event.date} | 📍 {event.location}</p>
              <Image
                src={event.user.thumbnail}
                alt={event.user.name}
                width={32}
                height={32}
                priority
                className="rounded-full border border-gray-300 mr-2"
              />
              <span className="text-gray-700">{event.user.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventSchedule;