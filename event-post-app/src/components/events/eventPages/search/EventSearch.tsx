'use client';
import { useEvents } from '../../hooks/useEvents';
import { useSearchEvents } from './hooks/useSearchEvents';

import LikeButton from '@/components/like/LikeButton';
import {
  getEventDate,
  getEventWeekday,
} from '@/components/events/utils/EventDateDisplay';
import MapImageGenerate from '@/components/map/MapImageGenerate';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import type { Event } from '@/types/event.type';

// type ImageSize =

export default function EventSearch() {
  const {
    currentUser,
    currentUserFromHook,
    router,
    defaultEventImage,
    defaultUserImage,
  } = useEvents();

  const {
    searchKeyword,
    setSearchKeyword,
    searchResults,
    triggerSearch,
    setTriggerSearch,
  } = useSearchEvents();

  const handleSearchClick = () => {
    setTriggerSearch(true);
  };

  return (
    <div className="flex flex-col h-screen mx-auto">
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="イベントを検索..."
            className="w-full px-5 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <Search className="absolute right-5 top-4 text-gray-500 w-6 h-6" />
        </div>

        <div className="ml-6">
          <button
            onClick={handleSearchClick}
            className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition whitespace-nowrap"
          >
            検索
          </button>
        </div>
      </div>

      <MapImageGenerate searchResults={searchResults} />

      <div className="w-full mt-4">
        {searchResults.map((event: Event) => {
          const isCreator =
            currentUserFromHook && event.user.id === currentUser?.id;
          const mmdd = getEventDate(event.date);
          const weekday = getEventWeekday(event.date);

          return (
            <div
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="cursor-pointer flex flex-row mb-2 relative w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all py-3 px-3"
            >
              <div className="flex ml-2 gap-4">
                <div className="relative w-[160px] h-[110px]">
                  <Image
                    src={event.image_url || defaultEventImage}
                    alt={event.title}
                    width={150}
                    height={150}
                    priority
                    className="object-cover shadow-sm rounded-md w-[160px] h-[110px]"
                  />
                  <div className="flex absolute bottom-0 right-0 text-xs bg-gray-200 opacity-90 p-1 rounded-md">
                    <LocationMarkerIcon className="w-4 h-4 text-orange-500" />
                    <p className="text-gray-600 font-semibold text-xs">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex w-[130px] flex-col">
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
                            src={event.user.thumbnail_url || defaultUserImage}
                            alt={event.user.name}
                            width={24}
                            height={24}
                            priority
                            className="w-6 h-6 rounded-full object-cover border border-orange-400 mr-1"
                          />
                          <span>{event.user.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex absolute bottom-1 right-3 justify-end">
                  {/* <LikeButton
                    eventId={event.id}
                    initialLiked={event.liked}
                    initialLikesCount={event.likes_count}
                    currentUserId={currentUser?.id}
                    disabled={!currentUser}
                  /> */}
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
