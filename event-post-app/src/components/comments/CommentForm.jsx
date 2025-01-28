'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { fetchAPI } from "@/utils/api"; // 共通のAPIユーティリティをインポート

export default function CommentForm({ eventId }) {
    const [formData, setFormData] = useState({ comment: "" });
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(null);

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

        const commentPayload = {
            comment: {
                content: formData.comment,
            },
        };

        try {
            const res = await fetchAPI(`/events/${eventId}/comments`, {
                method: "POST",
                body: JSON.stringify(commentPayload),
            });

            setIsSuccess(true);
            setMessage("コメントを作成しました！");
            setFormData({ comment: "" });
            router.refresh(); // ページをリフレッシュしてコメント一覧を更新
        } catch (error) {
            setIsSuccess(false);
            setMessage(error.message || "コメント作成に失敗しました。再試行してください。");
        }
    };

    return (
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-l block mb-2" htmlFor="comment">コメントを投稿しよう！</label>
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
                <Button
                    type="submit"
                    className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl"
                >
                    投稿する
                </Button>
            </form>
            {message && (
                <p className={`mt-4 text-xl ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </div>
    );
}