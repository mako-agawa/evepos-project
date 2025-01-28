'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { Button } from '../ui/button';
import { fetchAPI } from '@/utils/api';
import Image from 'next/image';

export default function UserShow() {
    const [user, setUser] = useState();

    const { currentUser } = useCurrentUser();
    const router = useRouter();
    const params = useParams();
    const userId = params.id;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            try {
                const res = await fetch(`${API_URL}/users/${userId}`, { method: 'GET' });
              
                if (!res.ok) {
                  const errorData = await res.json().catch(() => null);
                  throw new Error(errorData?.message || `HTTP Error: ${res.status}`);
                }
              
                const userData = await res.json();
                setUser(userData);
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
            
        };
        
        fetchUser();
    }, [userId]);
    console.log(user);

    const handleUserDelete = async () => {
        if (!confirm("本当にこのユーザーを削除しますか？")) return;

        try {
            await fetchAPI(`${API_URL}/users/${userId}`, { method: "DELETE" });
            alert("ユーザーが削除されました。");
            router.push('/'); // リダイレクト
        } catch (error) {
            console.error(error.message);
            alert("ユーザーの削除に失敗しました。");
        }
    };


    if (!user) return null;

    const isCurrentUser = currentUser && user && currentUser.id === user.id;

    return (
        <div className="flex flex-col items-center bg-gray-100 px-4 max-w-screen-lg mx-auto  h-screen">
            <h1 className="text-3xl font-bold text-gray-800">
                {isCurrentUser ? 'マイページ' : 'ユーザーページ'}
            </h1>
            <div >
                <div className="p-8 my-4 rounded shadow-md bg-white w-full">
                    {user.thumbnail_url && (
                        <Image
                            src={user.thumbnail_url}
                            alt="User Thumbnail"
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full mb-6 shadow-md"
                        />
                    )}
                    <p className="text-gray-700 text-xl">名前: {user.name}</p>
                    <p className="text-gray-700 text-xl">メール: {user.email}</p>
                    <p className="text-gray-700">概要:</p>
                    <p className="text-gray-700">{user.description}</p>
                </div>
                {isCurrentUser && (
                    <Button
                        onClick={() => handleUserDelete(userId)}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition-all"
                    >
                        削除
                    </Button>
                )}
            </div>
        </div>
    );
}