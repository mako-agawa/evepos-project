'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams, useRouter } from 'next/navigation';
import useHandleDelete from '@/hooks/useHandelDelete';
import { fetchAPI } from '@/utils/api';
import RenderDescription from '../general/RenderDescription';
import { Button } from '../ui/button';
import CommentForm from '@/components/comments/CommentForm';



export default function EventShow() {
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  console.log(comments);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 🔹 モーダル開閉の状態管理

  const { currentUser, refetchUser } = useCurrentUser(); // 🔹 refetchUser() でデータを再取得
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  const { handleEventDelete, handleCommentDelete } = useHandleDelete(API_URL, eventId, comments, setComments);

  useEffect(() => {
    if (!eventId) {
      setError('Invalid Event ID');
      return;
    }

    const fetchData = async () => {
      try {
        const eventData = await fetchAPI(`${API_URL}/events/${eventId}`);
        setEvent(eventData);

        const userData = await fetchAPI(`${API_URL}/users/${eventData.user_id}`);
        setUser(userData);

        const commentsData = await fetchAPI(`${API_URL}/events/${eventId}/comments`);
        setComments(commentsData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [eventId]);

  useEffect(() => {
    console.log("コメント投稿後、ユーザー情報を更新");
    refetchUser(); // 🔹 `currentUser` を最新に更新
  }, [comments]);

  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!event || !user) return <div className="text-gray-600">読み込み中...</div>;

  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="flex flex-col items-center bg-gray-100 px-4 max-w-screen-lg mx-auto">
      <div className="px-8 py-4 my-4 mb-8 rounded shadow-md bg-white w-full">
        <div className="flex justify-end items-center gap-2">
          <p className="font-semibold text-sm text-gray-500">post by</p>
          {user.thumbnail_url && (
            <Image
              src={user.thumbnail_url}
              alt="image"
              width={30}
              height={30}
              className="rounded-md"
            />
          )}
          <p className="font-semibold text-xl text-gray-500">{user.name}</p>
        </div>
        <h1 className="text-3xl font-bold text-gray-700 pb-1">{event.title}</h1>
        {event.image_url && (
          <Image
            src={event.image_url}
            alt="image"
            width={500}
            height={300}
            className="rounded-md"
          />
        )}
        <p className="text-gray-700">日時: {event.date}</p>
        <p className="text-gray-700">場所: {event.location}</p>
        <p className="text-gray-700">概要:</p>
        <RenderDescription text={event.description} />
        <p className="text-gray-700">費用: {event.price}</p>

      </div>
      <div className="flex justify-end items-center gap-4">
        {/* 🔹 モーダルを開くボタン */}
        <Button
          onClick={() => setIsOpen(true)}
          className="text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-md"
        >
          コメントを書く
        </Button>
        {isCurrentUser && (
          <div className="flex gap-4">
            <Button onClick={() => router.push(`/events/${eventId}/edit`)} className="bg-green-500 text-white px-4 py-2 rounded">
              編集
            </Button>
            <Button onClick={handleEventDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              削除
            </Button>
          </div>
        )}
      </div>


      {/* 🔹 モーダル部分 */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center px-4 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)} // 🔹 背景クリックで閉じる
        >
          <div
            className="bg-gray-100 flex flex-col pb-10 justify-center rounded shadow-md w-full max-w-lg"
            onClick={(e) => e.stopPropagation()} // 🔹 モーダル内クリックで閉じない
          >
            <h2 className="text-lg font-bold text-gray-700 ml-5 my-2">コメントを投稿</h2>
            <CommentForm
              API_URL={API_URL}
              eventId={eventId}
              setComments={setComments}
              closeModal={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}


      <div className="px-8 py-4 pb-8 mt-8 mb-16 rounded shadow-md bg-white w-full">
        <h2 className="text-md text-gray-500 font-bold">コメント一覧</h2>

        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment?.id || `comment-${index}`} className="border p-2 mb-2 rounded shadow">
              <div className="flex justify-start items-center gap-2">
                {/* 🔹 `comment.user` が `undefined` でないか確認 */}
                {comment.user?.thumbnail_url ? (
                  <Image
                    src={comment.user.thumbnail_url}
                    alt="User thumbnail"
                    width={25}
                    height={25}
                    className="rounded-md"
                  />
                ) : (
                  <Image
                    src="/default-userImage.svg" // 🔹 デフォルト画像を設定
                    alt="Default user thumbnail"
                    width={25}
                    height={25}
                    className="rounded-md"
                  />
                )}
                <p className="font-semibold text-gray-500">{comment.user?.name || "匿名"}</p>
              </div>
              <p className="font-semibold pl-12">{comment.content}</p>
              {isCurrentUser && (
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-red-500 underline"
                >
                  削除
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">コメントはありません</p>
        )}
      </div>
    </div>
  );
}