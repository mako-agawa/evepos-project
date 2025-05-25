'use client';

import { fetchAPI } from '@/utils/fetchAPI';
import { Dispatch, SetStateAction } from 'react';

interface Comment {
  id: number;
}

type UseHandleDelete = {
  handleEventDelete: (eventId: number) => Promise<void>;
  handleCommentDelete: (commentId: number) => Promise<void>;
  handleUserDelete: (userId: number) => Promise<void>;
};

const useHandleDelete = (
  API_URL: string,
  eventId: number,
  comments: Comment[],
  setComments: Dispatch<SetStateAction<Comment[]>>
): UseHandleDelete => {
  // イベント削除
  const handleEventDelete = async (eventId: number): Promise<void> => {
    console.log('eventId:', eventId); // ここで確認
    if (!confirm('本当にこのイベントを削除しますか？')) return;

    try {
      await fetchAPI(`${API_URL}/events/${eventId}`, { method: 'DELETE' });
      alert('イベントが削除されました。');
      window.location.href = '/'; // トップページへ遷移
    } catch (error) {
      alert('イベントの削除に失敗しました。');
    }
  };

  // コメント削除
  const handleCommentDelete = async (commentId: number): Promise<void> => {
    if (!confirm('本当にこのコメントを削除しますか？')) return;
    try {
      await fetchAPI(`${API_URL}/events/${eventId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      // 削除後にコメント一覧を更新
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      alert('コメントが削除されました。');
    } catch (error) {
      alert('コメントの削除に失敗しました。');
      console.error(error);
    }
  };

  // ユーザー削除
  const handleUserDelete = async (userId: number): Promise<void> => {
    if (!confirm('本当にこのユーザーを削除しますか？')) return;
    try {
      await fetchAPI(`${API_URL}/users/${userId}`, { method: 'DELETE' });
      alert('ユーザーが削除されました。');
    } catch (error) {
      alert('ユーザーの削除に失敗しました。');
    }
  };
  return { handleEventDelete, handleCommentDelete, handleUserDelete };
};

export default useHandleDelete;
