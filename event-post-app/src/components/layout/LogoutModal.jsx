'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAtom } from 'jotai';
import { pageModeAtom } from '@/atoms/authAtom';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const LogoutModal = () => {
    const { auth, logout } = useAuth();
    const router = useRouter();
    const [, setPageMode] = useAtom(pageModeAtom);
    const { currentUser } = useCurrentUser();
    c


    const handleLogout = () => {
        console.log('ログアウト');
        logout();  // ログアウト処理
        setPageMode('index');  // ページモードをリセット
        router.push('/');  // ホームページにリダイレクト
    };

    const handleCancel = () => {
        console.log('キャンセル');
        setPageMode('index');  // ページモードをリセット
        router.push('/');  // ホームページにリダイレクト
    };

    return (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h1 className="text-2xl font-bold text-center">ログアウト</h1>
            <div className="flex flex-col py-8 text-center">
                <div className="flex flex-row items-center justify-center text-gray-700 text-3xl font-bold px-4 py-2">
                    <Image
                        src={currentUser.thumbnail_url || "/default-avatar.png"}
                        alt={currentUser.name || "ゲスト"}
                        width={48}
                        height={48}
                        className="rounded-full border border-gray-300 mr-2"
                    />
                    <span>{currentUser.name || "ゲスト"} さん</span>
                </div>
                <p className="text-lg pb-6 text-gray-500">※上記のアカウントでログアウトします.</p>
            </div>
            <div className="flex justify-between">
                <button
                    onClick={handleLogout}
                    className="w-1/2 text-white bg-red-700 hover:bg-red-800 rounded p-3 text-xl"
                >
                    ログアウト
                </button>
                <button
                    onClick={handleCancel}
                    className="w-1/2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded p-3 text-xl ml-4"
                >
                    キャンセル
                </button>
            </div>
        </div>
    );
};

export default LogoutModal;