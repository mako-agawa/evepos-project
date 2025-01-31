'use client';

import EventForm from './EventForm';
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { pageModeAtom } from "@/atoms/authAtom";
import { useState } from 'react';

export default function EventCreate() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [, setPageMode] = useAtom(pageModeAtom);
    const router = useRouter();
    const [message, setMessage] = useState('');

    const handleSubmit = async (formData, imageFile) => {
        const eventPayload = new FormData();
        Object.keys(formData).forEach((key) => {
            eventPayload.append(`event[${key}]`, formData[key]);
        });
        if (imageFile) {
            eventPayload.append('event[image]', imageFile);
        }

        const authToken = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                Authorization: authToken ? `Bearer ${authToken}` : '',
            },
            body: eventPayload,
        });

        if (res.ok) {
            setMessage('イベントが正常に作成されました！');
            setPageMode('index');
            router.push("/");
        } else {
            setMessage('イベントの作成に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <h1 className="text-gray-500 b border-b-2 border-orange-400 px-6 text-2xl mb-8">イベント投稿</h1>
            <EventForm
                initialData={{
                    title: '',
                    date: '',
                    location: '',
                    description: '',
                    price: '',
                }}
                onSubmit={handleSubmit}
                buttonText="投稿する"
            />
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}