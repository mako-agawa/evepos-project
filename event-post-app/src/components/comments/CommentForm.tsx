'use client';

import { useState } from 'react';
import { fetchAPI } from '@/utils/fetchAPI';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation'; // 変更点1: redirect ではなく useRouter を使う
import { SubmitButton } from '../utils/SubmitButton';
import { Message } from '../utils/Message';
import { TextInput } from '../utils/TextInput';

interface CommentFormProps {
  eventId: string | number;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  closeModal: () => void;
}

export default function CommentForm({
  eventId,
  setComments,
  closeModal,
}: CommentFormProps) {
  const [formData, setFormData] = useState({ comment: '' });
  const [message, setMessage] = useState('');
  const { currentUser } = useCurrentUser();
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return; 

    const commentPayload = {
      comment: {
        content: formData.comment,
        user_id: currentUser.id,
      },
    };

    try {
      const res = (await fetchAPI(`/events/${eventId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentPayload),
      })) as { comment: any };

      setComments((prev) => [res.comment, ...prev]);

      setFormData({ comment: '' });
      setMessage('コメントを作成しました！');

      closeModal();

      router.push(`/events/${eventId}`); 
      router.refresh(); // データ更新のためにリフレッシュ

    } catch (error) {
      console.error(error);
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