'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/utils/api";
import { Button } from "@/components/ui/button"; 

export default function UserEdit() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        description: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetchAPI(`${API_URL}/users/${userId}`);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: '',
                    password_confirmation: '',
                    description: userData.description || '',
                });
                setLoading(false);
            } catch (error) {
                setMessage("ユーザー情報の取得に失敗しました。");
                setLoading(false);
            }
        };
        fetchUser();
    }, [API_URL, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("認証エラー: ログインしてください");
            return;
        }

        const userPayload = new FormData();
        userPayload.append("user[name]", formData.name);
        userPayload.append("user[email]", formData.email);
        userPayload.append("user[description]", formData.description);

        if (formData.password.trim() !== '') {
            userPayload.append("user[password]", formData.password);
            userPayload.append("user[password_confirmation]", formData.password_confirmation);
        }

        if (thumbnail) {
            userPayload.append("user[thumbnail]", thumbnail);
        }

        try {
            const res = await fetchAPI(`${API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: userPayload, // JSONではなくFormDataを使用
            });
            console.log(userPayload);

            if (!res.ok) throw new Error("更新に失敗しました");

            setMessage("更新しました！");
            router.push(`/users/${userId}`);
        } catch (error) {
            console.error("Update failed:", error.message);
            setMessage("更新に失敗しました。");
        }
    };

    if (loading) return <p>読み込み中...</p>;

    return (
        <div className="flex flex-col items-center h-screen px-4 py-8  bg-gray-100">
            <h1 className="text-4xl font-bold p-8">ユーザー編集</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8  mx-auto rounded shadow-md w-full max-w-lg">
                <div>
                    <label className="text-mb block mb-2" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-mb block mb-2" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-mb block mb-2" htmlFor="password">Password (変更時のみ入力):</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-mb block mb-2" htmlFor="password_confirmation">Password Confirmation:</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-mb block mb-2" htmlFor="thumbnail">Thumbnail:</label>
                    <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {formData.thumbnail && (
                        <img
                            src={formData.thumbnail}
                            alt="Current Thumbnail"
                            className="mt-4 w-32 h-32 object-cover rounded-md"
                        />
                    )}
                </div>
                <div>
                    <label className="text-mb block mb-2" htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                        rows="4"
                    />
                </div>
                <Button
                    className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl"
                    type="submit"
                >
                    更新する
                </Button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}