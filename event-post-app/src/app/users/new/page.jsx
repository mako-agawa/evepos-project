'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // useRouterフックをインポート
import { useAtom } from "jotai";
import { authAtom } from '@/atoms/authAtom';

export default function Register() {
   

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold p-8">新規登録</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-6">
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