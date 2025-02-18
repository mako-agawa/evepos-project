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
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { getEventDate, getEventTime, getEventWeekday } from '../general/EventDateDisplay';
import defaultUserImage from '/public/user.svg';
import defaultEventImage from '/public/image.svg';
import LikeButton from '../ui/LikeButton';

export default function EventShow() {
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 🔹 モーダル開閉の状態管理
  const { currentUser } = useCurrentUser(); // 🔹 refetchUser() でデータを再取得
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  // 修正: オプショナルチェイニングを使用
  const mmdd = getEventDate(event?.date);

  const weekday = getEventWeekday(event?.date);
  const hhmm = getEventTime(event?.date)

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
  }, [API_URL, eventId]);

  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!event || !user) return <div className="text-gray-600">読み込み中...</div>;

  const isCurrentUser = currentUser && user && currentUser.id === user.id;
  console.log(event);
  return (
    <div className="flex flex-col max-w-screen-lg">
      <h1 className="text-gray-400 border-b-2 border-orange-300 px-6 text-xl font-semibold mb-4">Event info</h1>
      <div className="flex flex-col pt-10 pb-4 px-4 mt-2 mb-8 relative rounded shadow-md bg-white">

        {/* 日時 */}
        <div className="flex items-center absolute top-2 left-4 gap-1 bg-orange-400 text-white py-1 px-2 rounded-full">
          <p className="font-bold">{mmdd}</p>
          <p className="text-sm">({weekday})</p>
          <p className="font-bold">{hhmm}</p>
        </div>
        <div onClick={() => router.push(`/users/${event.user_id}`)} className="flex items-center absolute top-2 right-4 gap-2">
          <p className="font-semibold text-xs text-gray-500">post by</p>
          <Image
            src={user.thumbnail_url || defaultUserImage}
            alt="image"
            width={200}
            height={200}
            className="w-8 h-8 rounded-full object-cover border border-orange-400"
          />

          <p className="font-semibold text-gray-500">{user.name}</p>
        </div>
        {/* 画像 */}
        <div>
          <Image
            src={event.image_url || defaultEventImage}
            alt="image"
            width={500}
            height={300}
            className="rounded-md mt-1 mb-2"
          />
        </div>
        <div className="flex justify-end">
          <div className="flex bg-gray-200 p-1 rounded-md">
            <LocationMarkerIcon className="w-4 h-4 text-orange-500" />
            <p className="text-gray-600 font-semibold text-xs">{event.location}</p>
          </div>
        </div>
        <h1 className="text-xl font-bold">{event.title}</h1>

        <div className='mt-4 mb-3 border border-gray-200 font-semibold text-sm w-full rounded-md shadow-sm p-2'>
          {<RenderDescription text={event.description} /> || "No description"}
        </div>
        <div className="w-fit  bg-gray-200 py-1 px-2 rounded-md">
          <p className=" font-semibold mt-1  text-sm">料金: {event.price}</p>
        </div>

        <div className="mt-2 flex justify-end">
          <LikeButton
            eventId={event.id}
            initialLiked={event.liked}  // APIから `liked` を直接取得する場合
            initialLikesCount={event.likes_count}
            currentUserId={currentUser?.id}  // currentUser の ID を渡す
            disabled={!currentUser}          // 未ログインの場合は無効
          />
        </div>
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
            <h2 className="text-lg font-bold  ml-5 my-2">コメントを投稿</h2>
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
        <h2 className="text-md text-gray-500 font-bold mb-2">コメント一覧</h2>

        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment?.id || `comment-${index}`} className="border border-orange-100 py-1 px-2 pb-2 mb-2 rounded shadow">
              <div className="flex justify-between items-top gap-2">
                <div onClick={() => router.push(`/users/${comment.user.id}`)}  className='flex items-center'>
                  <Image
                    src={comment.user?.thumbnail_url || defaultUserImage}
                    alt="User thumbnail"
                    width={25}
                    height={25}
                    className="w-6 h-6 rounded-full object-cover mr-1 border border-orange-400"
                  />

                  <p className="font-semibold text-xs text-gray-500">{comment.user?.name || "匿名"}</p>
                </div>

                {currentUser && comment.user && currentUser.id === comment.user.id && (
                  <button onClick={() => handleCommentDelete(comment.id)} className="bg-gray-400 text-white text-xs py-1 px-1 rounded">
                    削除
                  </button>
                )}
              </div>
              <p className=" pl-7">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">コメントはありません</p>
        )}
      </div>
    </div>
  );
}