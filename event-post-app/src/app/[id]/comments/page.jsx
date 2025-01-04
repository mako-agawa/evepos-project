'use client';

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CreateComment() {
    const [formData, setFormData] = useState({
        comment: '',
    });
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null); // 成功・失敗フラグ

    const router = useRouter();
    const params = useParams(); // params を取得
    const id = params?.id; // id を取得
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!API_URL) {
            setIsSuccess(false);
            setMessage('API URL が設定されていません。環境変数を確認してください。');
            return;
        }

        const authToken = localStorage.getItem("token");

        if (!authToken) {
            setIsSuccess(false);
            setMessage('認証トークンが見つかりません。ログインしてください。');
            return;
        }

        const commentPayload = {
            comment: { 
                content: formData.comment, 
            }
        };

        try {
            const res = await fetch(`${API_URL}/events/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(commentPayload),
            });

            if (res.ok) {
                setIsSuccess(true);
                setMessage('コメントを作成しました！');
                setFormData({ comment: '' });
                router.push(`/events/${id}`); // イベント詳細ページに遷移
            } else {
                const data = await res.json();
                setIsSuccess(false);
                setMessage(data.errors ? data.errors.join(', ') : 'コメント作成に失敗しました。再試行してください。');
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage('通信エラーが発生しました。');
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold p-8">コメント投稿</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="comment">コメント:</label>
                    <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl"
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