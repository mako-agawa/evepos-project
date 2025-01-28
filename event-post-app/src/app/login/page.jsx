// Login.jsx
'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { auth, login } = useAuth();  // login を取り出す

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(auth);

    try {
      // console.log(email);
      // console.log(password);
      await login(email, password);  // login 処理
      if (auth) {
        setMessage("ログインに成功しました");
      }
    } catch (error) {
      setMessage(error.message || "Failed to log in");
    }
  };
  return (
    <div className="flex flex-col items-center bg-gray-100 h-screen py-8  px-4">
      <h1 className="text-4xl font-bold text-gray-800 p-8">ログイン</h1>
      <form onSubmit={handleLogin} className="p-8 rounded shadow-md bg-white w-full max-w-lg space-y-6 mt-6">
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
      <Link
        href="/users/new"
        className="mt-8 inline-flex items-center justify-center py-2 px-4 text-center bg-orange-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 mr-8"
      >
        はじめての方はこちら
      </Link>
      {message && <p className="mt-4 text-xl text-red-500">{message}</p>}
    </div>
  );
}
