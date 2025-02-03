'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/utils/api";
import { Button } from "@/components/ui/button"; 
import Image from "next/image";
import { compressAndConvertToPNG } from "@/utils/ImageProcessor";

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
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

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

    const handleImageChange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
    
            try {
                const processedFile = await compressAndConvertToPNG(file);  // ユーティリティ関数を呼び出す
                setThumbnail(processedFile);
                setThumbnailPreview(URL.createObjectURL(processedFile));
                console.log("Processed file (PNG):", processedFile);
            } catch (error) {
                setMessage('画像の圧縮または変換に失敗しました。');
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        if (!token) {
            setMessage("認証エラー: ログインしてください");
            return;
        }
    
        const updatedData = new FormData();
    
        updatedData.append("user[name]", formData.name);
        updatedData.append("user[email]", formData.email);
        updatedData.append("user[password]", formData.password);
        updatedData.append("user[password_confirmation]", formData.password_confirmation);
        updatedData.append("user[description]", formData.description);
    
        if (thumbnail) {
            updatedData.append("user[thumbnail]", thumbnail); // 画像を追加
        }
    
        // デバッグ用
        console.log("===== SENT FORM DATA =====");
        for (let [key, value] of updatedData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}` // ✅ `Content-Type` は設定しない
                },
                body: updatedData, // ✅ JSON ではなく FormData を送る
            });
    
            if (!response.ok) throw new Error("ユーザー更新に失敗しました");
    
            const result = await response.json();
            console.log("Success:", result);
            router.push(`/users/${userId}`);
        } catch (error) {
            console.error("Error:", error);
            setMessage("更新に失敗しました。");
        }
    };

    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);

    if (loading) return <p>読み込み中...</p>;

    return (
        <div className="flex flex-col items-center h-full px-4 py-16">
            <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 mx-auto rounded shadow-md w-full max-w-lg">
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
                    <label className="text-mb block mb-2" htmlFor="password">Password:</label>
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
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                    {thumbnailPreview && (
                                            <div className="mt-2 flex justify-center">
                                                <Image
                                                    src={thumbnailPreview}
                                                    alt="選択した画像"
                                                    width={300}
                                                    height={200}
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
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