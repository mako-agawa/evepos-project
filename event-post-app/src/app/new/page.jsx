'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        image: '',
        description: '',
        price: '',
    });
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null); // 成功・失敗を判定するフラグ
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventPayload = {
            event: { 
                ...formData,
            }
        };

        // 認証トークンを取得
        const authToken = localStorage.getItem("token"); // 'authToken'から'token'に修正

        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken ? `Bearer ${authToken}` : '', // トークンを設定
            },
            body: JSON.stringify(eventPayload),
        });

        if (res.ok) {
            setIsSuccess(true);
            setMessage('イベントが正常に作成されました！');
            setFormData({
                title: '',
                date: '',
                location: '',
                image: '',
                description: '',
                price: '',
            });
            router.push("/"); // 成功時にリダイレクト
        } else {
            setIsSuccess(false);
            const data = await res.json();
            setMessage('イベントの作成に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold p-8">イベント投稿</h1>
            <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="title">タイトル:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
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
                        className="w-full border rounded p-2"
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
                        className="w-full border rounded p-2"
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
                        className="w-full border rounded p-2"
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
                        className="w-full border rounded p-2"
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
                        className="w-full border rounded p-2"
                    />
                </div>
                <button
                    className="w-full inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300"
                    type="submit"
                >
                    投稿する
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-xl ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
