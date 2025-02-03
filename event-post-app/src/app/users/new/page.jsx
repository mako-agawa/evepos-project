"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { authAtom } from '@/atoms/authAtom';
import imageCompression from "browser-image-compression";

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        description: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [auth, setAuth] = useAtom(authAtom);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // 入力変更ハンドラー
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 画像選択時のハンドラー
    const handleImageChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    // ユーザー登録時のハンドラー
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userPayload = new FormData();
        userPayload.append("user[name]", formData.name);
        userPayload.append("user[email]", formData.email);
        userPayload.append("user[password]", formData.password);
        userPayload.append("user[password_confirmation]", formData.password_confirmation);
        userPayload.append("user[description]", formData.description);

        if (thumbnail) {
            // 画像圧縮のオプション
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(thumbnail, options);
                
                // 圧縮後のファイル情報を表示
                console.log(`Original size: ${(thumbnail.size / 1024 / 1024).toFixed(2)} MB`);
                console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

                // 圧縮後の画像をFormDataに追加
                userPayload.append("user[thumbnail]", compressedFile);
            } catch (error) {
                console.error("画像圧縮エラー:", error);
                setMessage('画像圧縮に失敗しました。');
                return;
            }
        }

        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                body: userPayload,
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                setAuth({
                    isLoggedIn: true,
                    currentUser: data.user,
                    token: data.token,
                });
                setMessage('登録に成功しました！');
                router.push('/');
            } else {
                const errorResponse = await res.json();
                setMessage(errorResponse.errors ? errorResponse.errors.join(", ") : '登録に失敗しました。');
            }
        } catch (error) {
            console.error("登録エラー:", error);
            setMessage('登録中にエラーが発生しました。');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 py-8 bg-gray-100">
            <h1 className="text-4xl font-bold p-8">新規登録</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 mx-auto rounded shadow-md w-full max-w-lg space-y-6">
                {/* 各入力フィールド */}
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="password_confirmation">Password Confirmation:</label>
                    <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="thumbnail">Thumbnail:</label>
                    <input type="file" name="thumbnail" accept="image/*" onChange={handleImageChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border rounded p-2" rows="4" />
                </div>
                <button className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl" type="submit">登録する</button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}