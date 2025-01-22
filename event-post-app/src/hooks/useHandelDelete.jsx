'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const useHandleDelete = (API_URL, eventId, comments, setComments) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  // イベント削除関数
  const handleEventDelete = async () => {
    if (!confirm('本当にこのイベントを削除しますか？')) return;

    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        alert('イベントが正常に削除されました。');
        router.push('/');
      } else {
        throw new Error('イベントの削除に失敗しました。');
      }
    } catch (error) {
      console.error('イベント削除エラー:', error);
      setError(error.message);
    }
  };

  // コメント削除関数
  const handleCommentDelete = async (commentId) => {
    if (!confirm('本当にこのコメントを削除しますか？')) return;

    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/events/${eventId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        alert('コメントが削除されました。');
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error('コメントの削除に失敗しました。');
      }
    } catch (error) {
      console.error('コメント削除エラー:', error);
      setError(error.message);
    }
  };

  return { handleEventDelete, handleCommentDelete, error };
};

export default useHandleDelete;