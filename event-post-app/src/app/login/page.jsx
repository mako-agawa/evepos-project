// Login.jsx
'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const {auth, login } = useAuth();  // login を取り出す

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(e);
    
    try {
        // console.log(email);
        // console.log(password);
      await login(email, password);  // login 処理
    } catch (error) {
      setMessage(error.message || "Failed to log in");
    }
  };
  console.log(auth);
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
