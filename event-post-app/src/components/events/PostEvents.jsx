'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI } from '@/utils/api';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { getEventDate, getEventWeekday } from '@/components/general/EventDateDisplay';
import defaultUserImage from '/public/user.svg';
import defaultEventImage from '/public/image.svg';
import LikeButton from '../like/LikeButton';

export default function PostEvents() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const { currentUser } = useCurrentUser();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const params = useParams();
    const user_id = params?.id; // 🔹 URLのユーザーIDを取得

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
        return <div className="text-red-500 text-center">エラー: {error}</div>;
    }

    // if (!events.length) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <p className="text-2xl">読み込み中...</p>
    //         </div>
    //     );
    // }

    // 🔹 ユーザーIDと一致する投稿のみフィルタリング
    const postEvents = events.filter(event => event.user_id == user_id); 

    return (
        <div className="flex flex-col pb-4 h-full mx-auto">
            <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">投稿したイベント</h1>
            <div className="w-full">
                {postEvents.length > 0 ? (
                    postEvents.map((event) => {
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
                                            <p className="text-gray-600 font-semibold text-xs">{event.location}</p>
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
                                        <LikeButton
                                            eventId={event.id}
                                            initialLiked={event.liked}
                                            initialLikesCount={event.likes_count}
                                            currentUserId={currentUser?.id}
                                            disabled={!currentUser}
                                        />
                                    </div>
                                </div>
                                <div className="absolute top-1 left-1 flex flex-col items-center bg-orange-400 text-white p-2 rounded-full">
                                    <p className="text-s font-bold">{mmdd}</p>
                                    <p className="text-xs">({weekday})</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">このユーザーが投稿したイベントはありません。</p>
                )}
            </div>
        </div>
    );
}