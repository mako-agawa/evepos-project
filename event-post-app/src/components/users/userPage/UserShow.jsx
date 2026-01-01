'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/commons/button';
import { useAuth } from '@/components/auth/hooks/useAuth';
import Image from 'next/image';
import RenderDescription from '../../../utils/RenderDescription'; // パスは環境に合わせてください
import Link from 'next/link';
import { fetchAPI } from '@/utils/fetchAPI';

export default function UserShow() {
  const [user, setUser] = useState(null); // 初期値をnullに
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const { logout } = useAuth();
  const defaultUserImage = '/user.svg';

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // 修正1: fetch ではなく fetchAPI を使用する
        // fetchAPIはデータを直接返すので res.json() は不要
        const data = await fetchAPI(`/users/${userId}`);
        setUser(data);
      } catch (error) {
        console.error('Fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUserDelete = async () => {
    const isConfirmed = confirm('本当にこのユーザーを削除しますか？');
    if (!isConfirmed) return;
    try {
      // 修正2: パスから /api/v1 を削除 (fetchAPIのBASE_URLに含まれているため)
      const response = await fetchAPI(`/users/${userId}`, {
        method: 'DELETE',
      });
      // fetchAPIは成功時にデータを返す(またはthrowしない)のでこれでOK
      alert('ユーザーが削除されました。');
      logout();
      router.push('/');
    } catch (error) {
      console.error('Delete error:', error);
      alert('ユーザーの削除に失敗しました。');
    }
  };

  // 修正3: ローディング中の表示を追加
  if (loading) return <div className="p-4">Loading...</div>;
  
  // ユーザーが見つからなかった場合
  if (!user) return <div className="p-4">ユーザーが見つかりません</div>;

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
           {/* user.description が無い場合の対策 */}
          <RenderDescription text={user.description || ''} />
        </div>
        <Link
          href={`/users/${userId}/liked`}
          className="cursor-pointer bg-orange-400 p-2 rounded-md mt-4 shadow-md text-center inline-block"
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
            onClick={() => handleUserDelete()}
            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition-all"
          >
            退会
          </Button>
        </div>
      )}
    </div>
  );
}