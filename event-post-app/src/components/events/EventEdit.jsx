'use client';

import EventForm from './EventForm';
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

export default function EventEdit() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const params = useParams();
    const eventId = params?.id;
    const [eventData, setEventData] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            const data = await fetchAPI(`${API_URL}/events/${eventId}`);
            setEventData(data);
        };
        fetchEvent();
    }, [API_URL, eventId]);

    const handleSubmit = async (formData, imageFile) => {
        const eventPayload = new FormData();
        Object.keys(formData).forEach((key) => {
            eventPayload.append(`event[${key}]`, formData[key]);
        });
        if (imageFile) {
            eventPayload.append('event[image]', imageFile);
        }

        const authToken = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                Authorization: authToken ? `Bearer ${authToken}` : '',
            },
            body: eventPayload,
        });

        if (res.ok) {
            setMessage('イベントが正常に編集されました！');
            router.push(`/${eventId}`);
        } else {
            setMessage('イベントの編集に失敗しました。もう一度お試しください。');
        }
    };

    if (!eventData) return <p>読み込み中...</p>;

    return (
        <div className="flex flex-col items-center h-screen px-4">
            <h1 className="text-4xl font-bold text-gray-800 p-8">イベント編集</h1>
            <EventForm
                initialData={{
                    title: eventData.title,
                    date: eventData.date,
                    location: eventData.location,
                    description: eventData.description,
                    price: eventData.price,
                }}
                onSubmit={handleSubmit}
                buttonText="保存する"
            />
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}