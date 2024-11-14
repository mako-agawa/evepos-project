'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAtom } from '@/atoms/authAtom';
import { useSetAtom } from "jotai";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const setAuth = useSetAtom(authAtom);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);

                // 認証状態を設定して再描画をトリガー
                setAuth({
                    isLoggedIn: true,
                    currentUser: data.user,
                });
                router.refresh(); // 状態変更を強制的に再レンダリング
                router.push("/");
            } else {
                setMessage('Failed to log in');
            }
        } catch (error) {
            setMessage(`Login error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold p-8">ログイン</h1>
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-6">
                <div>
                    <label className="text-xl block mb-2" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
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