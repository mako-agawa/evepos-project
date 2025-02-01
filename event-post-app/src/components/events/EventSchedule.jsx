"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";
import { useRouter } from "next/navigation";
import LikeButton from "../ui/LikeButton";
import { getEventDate, getEventWeekday, getEventTime } from "@/components/general/EventDateDisplay"

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
                const eventData = await fetchAPI(`${API_URL}/events`);
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

    if (!events.length) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-2xl">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen items-center px-4 py-8">
            <h1 className="text-gray-500 b border-b-2 border-orange-300 text-2xl mb-8">イベントスケジュール</h1>
            <div className="w-full">
                {events.map((event) => {
                    const isCreator = currentUser && event.user_id === currentUser.id;
                    const mmdd = getEventDate(event.date);
                    const weekday = getEventWeekday(event.date);
                    const hhmm = getEventTime(event.date)

                    return (
                        <div
                            key={event.id}
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="cursor-pointer flex flex-row mb-2 relative w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all py-4 px-2"
                        >
                            <div className="relative flex xjustify-center ml-6">
                                {/* 画像のコンテナ（relative を適用） */}
                                <div className="w-[200px] h-[100px]">
                                <Image
                                    src={event.image_url || "/placeholder.png"}
                                    alt={event.title}
                                    width={200}
                                    height={150}
                                    priority
                                    className="object-cover shadow-sm  rounded-md w-[160px] h-[110px]"
                                />
                                </div>
                                <div className="flex w-1/2">

                                    {/* イベント詳細 */}
                                    <div className="flex flex-col w-full">
                                        <div className="flex flex-col items-center w-full">
                                            <div className="flex  flex-col items-start mt-1 text-gray-500 text-sm">

                                                <p>📍 {event.location}</p>
                                            </div>
                                            {/* タイトル & いいねボタン */}
                                            <div className="flex items-center justify-between mt-1">
                                                <h2
                                                    className={`text-lg font-semibold ${isCreator ? "text-orange-500" : "text-gray-700"
                                                        }`}
                                                >
                                                    {event.title}
                                                </h2>
                                            </div>




                                            {/* 投稿者情報 */}
                                            <div className="flex justify-end mt-1 text-xs text-gray-500">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={event.user.thumbnail_url || "/default-avatar.png"}
                                                        alt={event.user.name}
                                                        width={24}
                                                        height={24}
                                                        priority
                                                        className="rounded-full  border border-gray-300 m mr-1"
                                                    />
                                                    <span>{event.user.name}</span>
                                                </div>
                                            </div>
                                            {/* いいねボタンをオーバーレイ（absolute で右上） */}
                                        </div>
                                        <div className="flex justify-end">
                                            <LikeButton
                                                eventId={event.id}
                                                initialLiked={!!event.liked}
                                                initialLikesCount={event.likes_count}
                                                disabled={!currentUser}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-1 left-0 flex flex-col items-center bg-orange-400 text-white p-2 rounded-full">
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