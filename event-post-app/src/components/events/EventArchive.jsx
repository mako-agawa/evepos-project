"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";
import { useRouter } from "next/navigation";
import LikeButton from "../ui/LikeButton";
import { getEventDate, getEventWeekday, getEventTime } from "@/components/general/EventDateDisplay"
import { LocationMarkerIcon } from "@heroicons/react/outline";
import defaultEventImage from '/public/image.svg';
import defaultUserImage from '/public/user.svg';

const EventIndex = () => {
    const [auth] = useAtom(authAtom);
    const router = useRouter();
    const currentUser = auth.currentUser;
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventData = await fetchAPI(`${API_URL}/events/archive`);
                setEvents(eventData);
            } catch (error) {
                setError(error.message);
                console.error("Failed to fetch events:", error);
            }
        };

        fetchEvents();
    }, [API_URL]);

    if (!events.length && !error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-2xl">該当のイベントはありません。</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">エラー: {error}</div>;
    }

    return (
        <div className="flex flex-col pb-4 h-full mx-auto">
            <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">Archive</h1>
            <div className="w-full">
                {events.map((event) => {
                    const mmdd = getEventDate(event.date);
                    const weekday = getEventWeekday(event.date);

                    return (
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
                                        <p className="text-gray-600 font-semibold text-xs">{event.location}</p>
                                    </div>
                                </div>
                                <div className="flex w-[260px] flex-col">

                                    {/* イベント詳細 */}
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col items-start w-full">

                                            {/* タイトル & いいねボタン */}
                                            <div className="flex items-center justify-between mt-1">
                                                <h2
                                                    className="font-semibold  border-b border-gray-200 shadow-sm"
                                                >
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
                                        <div className="flex absolute bottom-1 right-3 justify-end">
                                            <LikeButton
                                                eventId={event.id}
                                                initialLiked={event.liked}  // APIから `liked` を直接取得する場合
                                                initialLikesCount={event.likes_count}
                                                currentUserId={currentUser?.id}  // currentUser の ID を渡す
                                                disabled={!currentUser}          // 未ログインの場合は無効
                                            />
                                        </div>
                                </div>
                            </div>
                            <div className="absolute top-1 left-1 flex flex-col items-center bg-gray-400 text-white p-2 rounded-full">
                                <p className="text-s font-bold">{mmdd}</p>
                                <p className="text-xs">({weekday})</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default EventIndex;