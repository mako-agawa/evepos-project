'use client';

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import { Button } from '../ui/button';

export default function EventEdit() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const params = useParams();
    const eventId = params?.id;
    const [eventData, setEventData] = useState(null);
    const [imageFile, setImageFile] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            const data = await fetchAPI(`${API_URL}/events/${eventId}`);
            setEventData(data);
        };
        fetchEvent();
    }, [API_URL, eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("認証エラー: ログインしてください");
            return;
        }

        const formData = new FormData();
        formData.append("event[title]", eventData.title);
        formData.append("event[date]", eventData.date);
        formData.append("event[location]", eventData.location);
        formData.append("event[description]", eventData.description);
        formData.append("event[price]", eventData.price);

        if (imageFile) {
            formData.append("event[image]", imageFile);
        }

        console.log("===== SENT FORM DATA =====");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await fetch(`${API_URL}/events/${eventId}`, {
                method: "PATCH", 
                headers: {
                    "Authorization": `Bearer ${token}` // 🔹 Content-Type は設定しない
                },
                body: formData, // 🔹 JSON ではなく FormData を送信
            });

            if (!response.ok) throw new Error("イベントの更新に失敗しました");

            const result = await response.json();
            console.log("Success:", result);
            router.push(`/events/${eventId}`);
        } catch (error) {
            console.error("Error:", error);
            setMessage("更新に失敗しました。");
        }
    };
    if (!eventData) return <p>読み込み中...</p>;

    return (
        <div className="flex flex-col items-center h-screen px-4">
            <h1 className="text-4xl font-bold text-gray-800 p-8">イベント編集</h1>
            <form onSubmit={handleSubmit} className="p-6  rounded shadow-md bg-white w-full h-screen max-w-lg pb-12">
            <div>
                <label className="text-md block mb-2" htmlFor="title">タイトル:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={eventData.title}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-md block my-2" htmlFor="date">日時:</label>
                <input
                    type="text"
                    id="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-md block my-2" htmlFor="location">場所:</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-md block my-2" htmlFor="image">画像:</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="text-md block my-2" htmlFor="description">概要:</label>
                <textarea
                    id="description"
                    name="description"
                    value={eventData.description}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                    rows="4"
                />
            </div>
            <div>
                <label className="text-md block my-2" htmlFor="price">金額:</label>
                <input
                    id="price"
                    name="price"
                    value={eventData.price}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                />
            </div>
            <Button
                className="w-full inline-flex mt-8 items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                type="submit"
            >
                更新する
            </Button>
        </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}