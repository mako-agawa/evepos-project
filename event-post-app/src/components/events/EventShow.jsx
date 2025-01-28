// components/EventShow.jsx
'use client';

import Image from 'next/image';
import CommentForm from '@/components/comments/CommentForm';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams, useRouter } from 'next/navigation';
import useHandleDelete from '@/hooks/useHandelDelete';
import { fetchAPI } from '@/utils/api';
import RenderDescription from '../general/RenderDescription';

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
    <div className="flex flex-col items-center bg-gray-100 px-4 max-w-screen-lg mx-auto">
      <div className="p-8 my-4 rounded shadow-md bg-white w-full">
      <h1 className="text-3xl font-bold text-gray-800 pb-2">{event.title}</h1>
        <p className="text-gray-700">post by : {user.name}</p>
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
        <RenderDescription className="" text={event.description} />
        <p className="text-gray-700">費用: {event.price}</p>

        { currentUser && (
          <div className="flex gap-4">
            <button onClick={() => router.push(`/${event.id}/edit`)} className="bg-green-500 text-white px-4 py-2 rounded">
              編集
            </button>
            <button onClick={handleEventDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              削除
            </button>
          </div>
        )}
      </div>
      <div className="px-8 py-4 rounded shadow-md bg-white w-full space-y-2">
        <h2 className="text-x font-bold">コメント一覧</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-4 rounded shadow">
              <p className="font-semibold">{comment.user.name}</p>
              <p>{comment.content}</p>
              {currentUser && (
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-red-500 underline"
                >
                  削除
                </button>
              )}
            </div>
          ))}
        </div>

        {/* コメント投稿フォーム */}
        <CommentForm eventId={event.id} />
      </div>
    </div>

  );
}