'use client';
import { useState } from 'react';
import { Button } from '@/styles/button';
import { fetchAPI } from '@/utils/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { redirect } from 'next/navigation';

export default function CommentForm({
  API_URL,
  eventId,
  setComments,
  closeModal,
}) {
  const [formData, setFormData] = useState({ comment: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const { currentUser } = useCurrentUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentPayload = {
      comment: {
        content: formData.comment,
        user_id: currentUser.id, // ログインユーザーの ID をセット
      },
    };

    try {
      const res = await fetchAPI(`${API_URL}/events/${eventId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentPayload),
      });

      setComments((prev) => [res.comment, ...prev]); // 🔹 新しいコメントを一覧に追加

      setFormData({ comment: '' });
      setIsSuccess(true);
      setMessage('コメントを作成しました！');

      closeModal(); //  モーダルを閉じる
      redirect(`/events/${eventId}`); // 🔹 イベント詳細ページにリダイレクト
    } catch (error) {
      setIsSuccess(false);
      setMessage('コメント作成に失敗しました。');
    }
  };

  return (
    <div className="flex flex-col items-center px-5">
      <div className="bg-white p-8 rounded shadow-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />

          <Button
            type="submit"
            className="w-full text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-xl"
          >
            投稿する
          </Button>
        </form>
        {message && (
          <p
            className={`mt-4 text-xl ${isSuccess ? 'text-green-500' : 'text-red-500'}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
