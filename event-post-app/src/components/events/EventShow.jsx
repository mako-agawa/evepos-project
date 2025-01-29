'use client';

import Image from 'next/image';
import CommentForm from '@/components/comments/CommentForm';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams, useRouter } from 'next/navigation';
import useHandleDelete from '@/hooks/useHandelDelete';
import { fetchAPI } from '@/utils/api';
import RenderDescription from '../general/RenderDescription';
import { Button } from '../ui/button';

export default function EventShow() {
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ comment: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // 成功時は true, 失敗時は false


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

  // const handleCommentAdded = (newComment) => {
  //   // 新しいコメントをリストに追加
  //   setComments((prevComments) => [...prevComments, newComment]);
  // };


  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!event || !user) return <div className="text-gray-600">読み込み中...</div>;

  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  return (
    <div className="flex flex-col items-center bg-gray-100 px-4 max-w-screen-lg mx-auto">
      <div className="px-8 py-4 my-4 rounded shadow-md bg-white w-full">
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

        {isCurrentUser && (
          <div className="flex gap-4">
            <Button onClick={() => router.push(`/${event.id}/edit`)} className="bg-green-500 text-white px-4 py-2 rounded">
              編集
            </Button>
            <Button onClick={handleEventDelete} className="bg-red-500 text-white px-4 py-2 rounded">
              削除
            </Button>
          </div>
        )}
      </div>
      <div className="px-8 py-4 pb-16 rounded shadow-md bg-white w-full">
        <h2 className="text-lg text-gray-500 font-bold">コメント一覧</h2>
        <div className="">
          {comments.map((comment) => (
            console.log(comment), // ここで `thumbnail_url` があるか確認
            <div key={comment.id} className="border p-2 mb-2 rounded shadow">
              <div className="flex justify-start items-center gap-2">
                {comment.user.thumbnail_url && (
                  <Image
                    src={comment.user.thumbnail_url}
                    alt="User thumbnail"
                    width={25}
                    height={25}
                    className="rounded-md"
                  />
                )}
                <p className="font-semibold text-gray-500">{comment.user.name}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}