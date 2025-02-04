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
import defaultEventImage from '/public/default-image.png';
import defaultUserImage from '/public/default-user.svg';


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
                console.log("eventData", eventData);
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
        <div className="flex flex-col max-w-3xl h-full mx-auto">
            <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">New Events</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                {events.map((event) => {
                    const isCreator = currentUser && event.user_id === currentUser.id;
                    const mmdd = getEventDate(event.date);
                    const weekday = getEventWeekday(event.date);
                    const hhmm = getEventTime(event.date)

                    return (
                        <div
                            key={event.id}
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="cursor-pointer flex relative flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all p-2"
                        >

                            {/* 画像のコンテナ（relative を適用） */}
                            <div className="">
                                <div className="relative w-full h-[110px]">
                                    {/* 日時 */}
                                    <div className="flex  absolute top-0 left-0 items-center bg-orange-400 text-white font-semibold py-1 px-2 rounded-full">
                                        <p className="text-sm font-bold">{mmdd}</p>
                                        {/* <p className="text-xs">({weekday})</p> */}
                                    </div>
                                    <Image
                                        src={event.image_url || defaultEventImage}
                                        alt={event.title}
                                        width={210}
                                        height={150}
                                        priority
                                        className="object-cover shadow-sm rounded-md w-full h-[110px]"
                                    />

                                    <div className="flex absolute bottom-0 right-0 text-xs opacity-90 bg-gray-200 p-1 rounded-md">
                                        <LocationMarkerIcon className="w-4 h-4 text-orange-500" />
                                        <p className="text-gray-600 font-semibold text-xs">{event.location}</p>
                                    </div>
                                </div>
                                {/* イベント詳細 */}
                                <div className="flex flex-col items-start w-full mt-2">
                                    {/* タイトル & いいねボタン */}
                                    <div className="w-full my-1">
                                        <h2
                                            className="font-semibold border-b text-sm ">
                                            {event.title}
                                        </h2>
                                    </div>




                                    {/* 投稿者情報 */}
                                    <div className="flex mt-1 text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <Image
                                                src={event.user.thumbnail_url || defaultUserImage}
                                                alt={event.user.name}
                                                width={20}
                                                height={20}
                                                priority
                                                className="rounded-full border border-orange-400 m mr-1"
                                            />
                                            <span>{event.user.name}</span>
                                        </div>
                                    </div>
                                    {/* いいねボタンをオーバーレイ（absolute で右上） */}
                                </div>
                                <div className="flex justify-end">
                                    <LikeButton
                                        eventId={event.id}
                                        initialLiked={event.liked || false}  // APIから `liked` を直接取得する場合
                                        initialLikesCount={event.likes_count}
                                        currentUserId={currentUser?.id}  // currentUser の ID を渡す
                                        disabled={!currentUser}          // 未ログインの場合は無効
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default EventIndex;