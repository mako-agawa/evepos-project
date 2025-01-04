'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { authAtom, AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from '@/atoms/authAtom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useAtom(authAtom); // JotaiのauthAtomを使用
    const [message, setMessage] = useState('');
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
                const newAuth = {
                    isLoggedIn: true,
                    currentUser: data.user,
                };

                // トークンの保存
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);

                // Jotaiの状態を更新
                setAuth(newAuth);

                router.push("/");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to log in');
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
                <button className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl" type="submit">
                    ログインする
                </button>
            </form>
            {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
        </div>
    );
}
