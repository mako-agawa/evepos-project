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
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);

  const [error, setError] = useState(null);
  const { currentUser } = useCurrentUser(); // 🔹 refetchUser() でデータを再取得
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  // 修正: オプショナルチェイニングを使用
  const mmdd = getEventDate(event?.date);

  const weekday = getEventWeekday(event?.date);

  useEffect(() => {
    if (!eventId) {
      setError('Invalid Event ID');
      return;
    }

    const fetchData = async () => {
      try {
        const eventData = await fetchAPI(`/events/${eventId}`);
        setEvent(eventData);
        const userData = await fetchAPI(
          `/users/${eventData.user_id}`
        );
        setUser(userData);
        const likedUsersData = await fetchAPI(
          `/events/${eventId}/likes`
        );
        setLikedUsers(likedUsersData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [eventId]);

  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!event || !user)
    return <div className="text-gray-600">読み込み中...</div>;

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
            {/* 画像のコンテナ（relative を適用） */}
            <div className="relative w-full h-[110px]">
              <Image
                src={event.image_url || defaultEventImage}
                alt={event.title}
                width={210}
                height={150}
                priority
                className="object-cover  shadow-sm rounded-md  w-full h-[110px]"
              />
              <div className="flex absolute bottom-0 right-0 text-xs bg-gray-200 opacity-90 p-1 rounded-md">
                <LocationMarkerIcon className="w-4 h-4 text-orange-500" />
                <p className="text-gray-600 font-semibold text-xs">
                  {event.location}
                </p>
              </div>
            </div>
            <div className="flex w-[260px] flex-col">
              {/* イベント詳細 */}
              <div className="flex flex-col w-full">
                <div className="flex flex-col items-start w-full">
                  {/* タイトル & いいねボタン */}
                  <div className="flex items-center justify-between mt-1">
                    <h2 className="font-semibold  border-b border-gray-200 shadow-sm">
                      {event.title}
                    </h2>
                  </div>

                  {/* 投稿者情報 */}
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
                  {/* いいねボタンをオーバーレイ（absolute で右上） */}
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
            likedUsers.map((user) => (
              <div
                key={user.user.id}
                onClick={() => router.push(`/users/${user.user_id}`)}
                className="flex flex-col items-center"
              >
                <Image
                  src={user.user.thumbnail_url || defaultUserImage}
                  alt={user.user.name || 'User'}
                  width={100}
                  height={100}
                  className="w-20 h-20 rounded-full object-cover border border-orange-400"
                />
                <p className="text-xs font-semibold">
                  {user.user.name || '匿名ユーザー'}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
