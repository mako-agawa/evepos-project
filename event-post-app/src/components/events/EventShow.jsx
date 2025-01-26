'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Image from 'next/image';
import useHandleDelete from '@/hooks/useHandelDelete';
import Link from 'next/link';
import { fetchAPI } from '@/utils/api';

export default function EventShow() {
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  const { currentUser } = useCurrentUser();
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

  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!event || !user) return <div className="text-gray-600">読み込み中...</div>;

  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="flex flex-col items-center h-screen gap-6 w-full max-w-3xl">
      <h1 className="text-4xl font-bold p-24">イベント詳細</h1>
      <div className="text-2xl">
        <p className="pb-8">タイトル: {event.title}</p>
        <p className="pb-8">日時: {event.date}</p>
        <p className="pb-8">場所: {event.location}</p>
        {event.image_url && (
          <Image src={event.image_url} alt="image" width={500} height={300} layout="intrinsic" className="mb-6 shadow-md" />
        )}
        <p className="pb-8">説明: {event.description}</p>
        <p className="pb-8">金額: {event.price}</p>
        <p className="pb-8">投稿者: {user.name}</p>

        {isCurrentUser && (
          <div className="flex flex-row w-full my-4">
            <Link href={`/${eventId}/edit`} className="btn bg-green-500">Edit</Link>
            <button onClick={handleEventDelete} className="btn bg-red-500">Delete</button>
          </div>
        )}

        <div className="bg-gray-200 w-full my-12 p-4">
          <h1 className="text-xl my-4">コメント一覧</h1>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <Link href={`/users/${comment.user.id}`}>
                  <span className="font-semibold">{comment.user.name}</span>: {comment.content}
                </Link>
                {currentUser && comment.user.id === currentUser.id && (
                  <button onClick={() => handleCommentDelete(comment.id)} className="btn bg-red-500">削除</button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">コメントはまだありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}