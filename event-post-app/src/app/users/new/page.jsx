'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // useRouterフックをインポート
import { useAtom } from "jotai";
import { authAtom } from '@/atoms/authAtom';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        description: '',
    });
    const [thumbnail, setThumbnail] = useState(null); // 画像ファイルの管理用ステート
    const [auth, setAuth] = useAtom(authAtom);
    // console.log(setAtom);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [message, setMessage] = useState('');
    const router = useRouter(); // useRouterを呼び出してrouterを定義

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]); // ファイルをステートに格納
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // `FormData`オブジェクトを作成し、フィールドを追加
        const userPayload = new FormData();
        userPayload.append("user[name]", formData.name);
        userPayload.append("user[email]", formData.email);
        userPayload.append("user[password]", formData.password);
        userPayload.append("user[password_confirmation]", formData.password_confirmation);
        userPayload.append("user[description]", formData.description);

        if (thumbnail) {
            userPayload.append("user[thumbnail]", thumbnail); // ファイルを送信データに追加
        }

        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            body: userPayload, // `FormData`オブジェクトを送信
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token); // トークンを保存
            console.log(data.token);
            setAuth({
                isLoggedIn: true,
                currentUser: data.user,
                token:  data.token // ログインユーザー情報を設定
            });
            setMessage('Registration successful!');
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                description: '',
            });
            setThumbnail(null);
            router.refresh();
            router.push('/users'); // usersページにリダイレクト
        } else {
            const errorResponse = await res.json();
            setMessage(errorResponse.errors ? errorResponse.errors.join(", ") : 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screenp px-4 py-8  pb-16  bg-gray-100">
            <h1 className="text-4xl font-bold p-8">新規登録</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 mx-auto rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="name">Name:</label>
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
                    <label className="text-xl block mb-2" htmlFor="email">Email:</label>
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
                    <label className="text-xl block mb-2" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="password_confirmation">Password Confirmation:</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="thumbnail">Thumbnail:</label>
                    <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="text-xl block mb-2" htmlFor="description">Description:</label>
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
                <button className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl" type="submit">登録する</button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}