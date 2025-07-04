'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/commons/button';
import { useAuth } from '@/components/auth/hooks/useAuth';
import Image from 'next/image';
import RenderDescription from '../../../utils/RenderDescription';
import defaultUserImage from '/public/user.svg';
import Link from 'next/link';

export default function UserShow() {
  const [user, setUser] = useState();
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          method: 'GET',
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP Error: ${res.status}`);
        }
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    };
    fetchUser();
  }, [API_URL, userId]);

  const handleUserDelete = async () => {
    // 確認ダイアログの戻り値を変数に格納
    const isConfirmed = confirm('本当にこのユーザーを削除しますか？');
    // キャンセルされた場合は処理を中断
    if (!isConfirmed) return;
    try {
      const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response) {
        alert('ユーザーが削除されました。');
        logout();
        router.push('/');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('ユーザーの削除に失敗しました。');
    }
  };

  if (!user) return null;
  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="flex flex-col bg-gray-100 px-4 max-w-screen-lg mx-auto mb-8">
      <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-6">
        {isCurrentUser ? 'Myページ' : 'ユーザーページ'}
      </h1>
      <div className="flex flex-col p-8 my-4 rounded shadow-md bg-white w-full">
        <div className="flex  items-center">
          <Image
            src={user.thumbnail_url || defaultUserImage}
            alt="User Thumbnail"
            width={72}
            height={72}
            className="w-24 h-24 rounded-full object-cover border-2 border-orange-400 mb-4 shadow-md"
          />
          <p className=" pl-6 font-bold text-2xl">{user.name}</p>
        </div>
        <p className=" font-semibold">メッセージ:</p>
        <div className=" p-2 text-sm border border-gray-400 rounded-md">
          <RenderDescription text={user.description} />
        </div>
        <Link
          href={`/users/${userId}/liked`}
          className="cursor-pointer bg-orange-400 p-2 rounded-md mt-4 shadow-md"
        >
          <h1 className="text-white">{user.name}さんが いいねしたイベント</h1>
        </Link>
      </div>

      {isCurrentUser && (
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => router.push(`/users/${userId}/edit`)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            編集
          </Button>
          <Button
            onClick={() => handleUserDelete(userId)}
            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition-all"
          >
            退会
          </Button>
        </div>
      )}
    </div>
  );
}
