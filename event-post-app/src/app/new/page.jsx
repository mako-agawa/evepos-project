'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditEvent({ params }) {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        image: '',
        description: '',
        price: '',
        user_id: '',
    });
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // イベント編集時の送信処理
    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventPayload = {
            event: { 
                title: formData.title,
                date: formData.date,
                location: formData.location,
                image: formData.image,
                description: formData.description,
                price: formData.price,
                user_id: formData.user_id,
            }
        };

        // 正しいAPI URLにデータを送信
        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventPayload),
        });

        if (res.ok) {
            setMessage('Event created successfully!');
            setFormData({
                title: '',
                date: '',
                location: '',
                image: '',
                description: '',
                price: '',
                user_id: '',
            });
            router.push("/"); // 成功時にリダイレクト
        } else {
            const data = await res.json();
            setMessage('Event creation failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold p-8">イベント投稿</h1>
            <form onSubmit={handleSubmit} className=" p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="title">タイトル:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="date">日時:</label>
                    <input
                        type="text"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="location">場所:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="image">画像 URL:</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full border  rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="description">説明:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border  rounded p-2"
                        rows="4"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="price">金額:</label>
                    <input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="user_id">ユーザーID:</label>
                    <input
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <button className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded p-3 text-xl" type="submit">投稿する</button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}