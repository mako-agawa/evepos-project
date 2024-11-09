'use client';

import { useEffect, useState } from "react";
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
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const eventId = params.id; // ここで直接paramsからidを取得

    // イベント情報を取得してフォームに初期値として設定
    useEffect(() => {
        const fetchEvent = async () => {
          try {
            const res = await fetch(`${API_URL}/events/${eventId}`);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setFormData({
                title: data.title,
                date: data.date,
                location: data.location,
                image: data.image,
                description: data.description,
                price: data.price,
                user_id: data.user_id,
            });
            setLoading(false);
          } catch (error) {
            setError(error.message);
            setLoading(false);
          }
        };
    
        fetchEvent();
    }, [eventId, API_URL]);

    // イベント編集時の送信処理
    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventPayload = {
            event: { // パラメータをeventオブジェクト内にネスト
                title: formData.title,
                date: formData.date,
                location: formData.location,
                image: formData.image,
                description: formData.description,
                price: formData.price,
                user_id: formData.user_id,
            }
        };

        const res = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventPayload),
        });

        if (res.ok) {
            setMessage('Event updated successfully!');
            router.push(`/${eventId}`); // 正しいidを使ってリダイレクト
        } else {
            const data = await res.json();
            setMessage(`Update failed: ${data.message}`);
        }
    };

    // ローディングやエラーの処理
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen ">
            <h1 className="text-4xl font-bold p-8">イベント編集</h1>
            <form onSubmit={handleSubmit} className=" p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="title">タイトル:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="description">説明:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                        required
                        className="w-full border  rounded p-2"
                    />
                </div>
                <button className="w-full inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300" type="submit">編集する</button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}