'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI } from '@/utils/api';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { getEventDate, getEventWeekday } from '@/utils/EventDateDisplay';
import defaultUserImage from '/public/user.svg';
import defaultEventImage from '/public/image.svg';

export default function LikedUsers() {
  const [likedEvents, setLikedEvents] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const user_id = params?.id;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchLikedEvents = async () => {
      try {
        // 🔹 取得した event_id のリストでイベントデータを取得
        const eventsData = await fetchAPI(`${API_URL}/events/liked/${user_id}`);

        setLikedEvents(eventsData);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch liked events:', error);
      }
    };

    fetchLikedEvents();
  }, [API_URL, user_id]);

  if (error) {
    return <div className="text-red-500 text-center">エラー: {error}</div>;
  }

  if (!likedEvents.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-500">
          いいねしたイベントはありません。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-4 h-full mx-auto">
      <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">
        いいねしたイベント
      </h1>
      <div className="w-full">
        {likedEvents.map((event) => {
          const mmdd = getEventDate(event.date);
          const weekday = getEventWeekday(event.date);

          return (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="cursor-pointer flex flex-row mb-2 relative w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all py-3 px-3"
            >
              <div className="flex ml-2 gap-4">
                <div className="relative w-full h-[110px]">
                  <Image
                    src={event.image_url || defaultEventImage}
                    alt={event.title}
                    width={210}
                    height={150}
                    priority
                    className="object-cover shadow-sm rounded-md w-full h-[110px]"
                  />
                  <div className="flex absolute bottom-0 right-0 text-xs bg-gray-200 opacity-90 p-1 rounded-md">
                    <LocationMarkerIcon className="w-4 h-4 text-orange-500" />
                    <p className="text-gray-600 font-semibold text-xs">
                      {event.location}
                    </p>
                  </div>
                </div>
                <div className="flex w-[260px] flex-col">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center justify-between mt-1">
                        <h2 className="font-semibold border-b border-gray-200 shadow-sm">
                          {event.title}
                        </h2>
                      </div>
                      <div className="flex mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Image
                            src={event.user?.thumbnail_url || defaultUserImage}
                            alt={event.user?.name || 'Unknown'}
                            width={24}
                            height={24}
                            priority
                            className="w-6 h-6 rounded-full object-cover border border-orange-400 mr-1"
                          />
                          <span>{event.user?.name || '不明'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1 left-1 flex flex-col items-center bg-orange-400 text-white p-2 rounded-full">
                <p className="text-s font-bold">{mmdd}</p>
                <p className="text-xs">({weekday})</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
