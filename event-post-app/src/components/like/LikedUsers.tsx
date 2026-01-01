'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI } from '@/utils/fetchAPI';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import {
  getEventDate,
  getEventWeekday,
} from '@/components/events/utils/EventDateDisplay';
import defaultUserImage from '/public/user.svg';
import defaultEventImage from '/public/image.svg';

export default function LikedUsers() {
  // stateの初期値をnullや空配列にする際、型エラーを防ぐため any を想定させる
  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [likedUsers, setLikedUsers] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  const mmdd = getEventDate(event?.date);
  const weekday = getEventWeekday(event?.date);

  useEffect(() => {
    if (!eventId) {
      setError('Invalid Event ID');
      return;
    }

    const fetchData = async () => {
      try {
        // 修正箇所1: URLを元に戻し、戻り値を 'any' としてキャスト
        // これにより user_id も title も自由にアクセスできるようになります
        const eventData = (await fetchAPI(`/events/${eventId}`)) as any;
        setEvent(eventData);

        // 修正箇所2: eventData が any なので .user_id にアクセス可能
        const userData = await fetchAPI(`/users/${eventData.user_id}`);
        setUser(userData);

        const likedUsersData = (await fetchAPI(
          `/events/${eventId}/likes`
        )) as any[];
        setLikedUsers(likedUsersData);
      } catch (error: any) {
        setError(error.message || 'エラーが発生しました');
      }
    };

    fetchData();
  }, [eventId]);

  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!event || !user)
    return <div className="text-gray-600">読み込み中...</div>;

  // currentUserのチェックも安全に行う
  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="flex flex-col pb-4 h-full mx-auto">
      <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">
        Liked Users
      </h1>
      <div className="w-full">
        <div
          key={event.id}
          onClick={() => router.push(`/events/${event.id}`)}
          className="cursor-pointer flex flex-row mb-2 relative w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all py-3 px-3"
        >
          <div className="flex ml-2 gap-4">
            <div className="relative w-full h-[110px]">
              <Image
                src={event.image_url || defaultEventImage}
                alt={event.title || 'Event Image'}
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
                        alt={event.user?.name || 'User'}
                        width={24}
                        height={24}
                        priority
                        className="w-6 h-6 rounded-full object-cover border border-orange-400 mr-1"
                      />
                      <span>{event.user?.name}</span>
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
        <h1 className="text-gray-400 px-6 text-xl font-semibold my-6">
          いいねしたユーザー
        </h1>
        <div className="grid grid-cols-4 gap-4">
          {likedUsers.length > 0 &&
            likedUsers.map((likedUser) => (
              <div
                key={likedUser.user.id}
                onClick={() => router.push(`/users/${likedUser.user_id}`)}
                className="flex flex-col items-center"
              >
                <Image
                  src={likedUser.user.thumbnail_url || defaultUserImage}
                  alt={likedUser.user.name || 'User'}
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-full object-cover border border-orange-400"
                />
                <p className="text-xs font-semibold">
                  {likedUser.user.name || '匿名ユーザー'}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}