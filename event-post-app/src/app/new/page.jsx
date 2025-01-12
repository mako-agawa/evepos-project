'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        price: '',
    });
    const [imageFile, setImageFile] = useState(null); // 画像ファイル用の状態
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

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]); // 選択されたファイルを設定
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventPayload = new FormData();
        Object.keys(formData).forEach((key) => {
            eventPayload.append(`event[${key}]`, formData[key]);
        });
        if (imageFile) {
            eventPayload.append('event[image]', imageFile); // 画像ファイルを追加
        }

        const authToken = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/events`, {
            method: 'POST',
            headers: {
                Authorization: authToken ? `Bearer ${authToken}` : '', // トークンを設定
            },
            body: eventPayload, // FormDataを送信
        });

        if (res.ok) {
            setMessage('イベントが正常に作成されました！');
            router.push("/"); // 成功時にリダイレクト
        } else {
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
                    <label className="text-xl block mb-2" htmlFor="image">画像:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
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
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}