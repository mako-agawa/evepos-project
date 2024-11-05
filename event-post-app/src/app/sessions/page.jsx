'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // useRouterフックをインポート

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginPayload = {
            email: formData.email,
            password: formData.password,
        };

        const res = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginPayload),
        });

        if (res.ok) {
            const data = await res.json();
            setMessage('Login successful!');
            localStorage.setItem('authToken', data.token); // トークンをローカルストレージに保存
            router.push('/'); // ログイン成功後にリダイレクト
        } else {
            setMessage('Login failed. Please check your credentials!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold p-8">ログイン</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-6">
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
                <button className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded p-3 text-xl" type="submit">ログインする</button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}