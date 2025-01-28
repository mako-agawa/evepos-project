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
        <div className="flex flex-col items-center h-screen gap-6 w-full max-w-3xl px-4">
            <h1 className="text-4xl font-bold p-8">新着イベント</h1>
            {events.map((event) => {
                const isCreator = currentUser && event.user_id === currentUser.id;
                const mmdd = getEventDate(event.date);
                const weekday = getEventWeekday(event.date);
                const hhmm = getEventTime(event.date);

                return (
                    <div
                        key={event.id}
                        onClick={() => router.push(`/${event.id}`)}
                        className="cursor-pointer flex items-center gap-6 p-5 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            width={96}
                            height={96}
                            priority
                            className="object-cover rounded-md"
                        />
                        <div>
                            <h2
                                className={`text-2xl font-semibold ${isCreator ? "text-orange-500" : "text-black"
                                    }`}
                            >
                                {event.title}
                            </h2>
                            <p className="text-gray-600">
                                開催日時: {mmdd}({weekday}) {hhmm}
                            </p>
                            <p className="text-gray-600 mt-1">
                                📍 {event.location}
                            </p>


                            {/* いいねボタン */}
                            <LikeButton
                                eventId={event.id}
                                initialLiked={!!event.liked}
                                initialLikesCount={event.likes_count}
                                disabled={!currentUser} // currentUserがnull/undefinedならtrue(=無効化)
                            />

                            <div className="flex items-center mt-2">
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
                    </div>
                );
            })}
        </div>
    );
};

export default EventIndex;