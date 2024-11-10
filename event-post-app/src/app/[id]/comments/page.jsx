'use client';

import { useState } from "react";
import { useRouter, useParams } from "next/navigation"; // useParamsを追加

export default function CreateComment() {
    const [formData, setFormData] = useState({
        comment: '',
    });
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(null); // 成功・失敗を判定するフラグ
    const router = useRouter();
    const { id } = useParams(); // useParamsからid（eventId）を取得

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const commentPayload = {
            comment: { 
                content: formData.comment, // コメント内容をpayloadに設定
            }
        };

        // 認証トークンを取得
        const authToken = localStorage.getItem("authToken");

        const res = await fetch(`${API_URL}/events/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken ? `Bearer ${authToken}` : '', // トークンを設定
            },
            body: JSON.stringify(commentPayload),
        });

        if (res.ok) {
            setIsSuccess(true);
            setMessage('Comment created successfully!');
            setFormData({
                comment: '',
            });
            router.push(`/${id}`); // 成功時にリダイレクト
        } else {
            setIsSuccess(false);
            const data = await res.json();
            setMessage(data.errors ? data.errors.join(', ') : 'Comment creation failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold p-8">コメント投稿</h1>
            <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="comment">コメント:</label>
                    <input
                        type="text"
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>
             
                <button className="w-full inline-flex items-center justify-center text-white bg-orange-400 hover:bg-orange-500 font-medium rounded-md mt-16 px-6 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-300" type="submit">投稿する</button>
            </form>
            {message && (
                <p className={`mt-4 text-xl ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}