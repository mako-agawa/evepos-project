'use client';
import { useState } from 'react';
import { fetchAPI } from '@/utils/fetchAPI';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { redirect } from 'next/navigation';
import { SubmitButton } from '../utils/SubmitButton';
import { Message } from '../utils/Message';
import { TextInput } from '../utils/TextInput';

export default function CommentForm({
  API_URL,
  eventId,
  setComments,
  closeModal,
}) {
  const [formData, setFormData] = useState({ comment: '' });
  const [message, setMessage] = useState('');
  // const [isSuccess, setIsSuccess] = useState(null);
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
      const res = await fetchAPI(`/events/${eventId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentPayload),
      });

      setComments((prev) => [res.comment, ...prev]); // 🔹 新しいコメントを一覧に追加

      setFormData({ comment: '' });
      // setIsSuccess(true);
      setMessage('コメントを作成しました！');

      closeModal(); //  モーダルを閉じる
      redirect(`/events/${eventId}`); // 🔹 イベント詳細ページにリダイレクト
    } catch (error) {
      // setIsSuccess(false);
      setMessage('コメント作成に失敗しました。');
    }
  };

  return (
    <div className="flex flex-col items-center px-5">
      <div className="bg-white p-8 rounded shadow-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="comment"
            id="comment"
            type="text"
            value={formData.comment}
            onChange={handleChange}
          />
          <SubmitButton label="投稿する" />
        </form>
        <Message message={message} />
      </div>
    </div>
  );
}
