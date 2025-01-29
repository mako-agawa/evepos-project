'use client';

import { fetchAPI } from "@/utils/api";

const useHandleDelete = (API_URL, eventId, comments, setComments) => {

  // イベント削除

  const handleEventDelete = async () => {
    console.log("eventId:", eventId);
    if (!confirm("本当にこのイベントを削除しますか？")) return;

    try {
      await fetchAPI(`${API_URL}/events/${eventId}`, { method: "DELETE" });
      alert("イベントが削除されました。");
      window.location.href = "/"; // トップページへ遷移
    } catch (error) {
      alert("イベントの削除に失敗しました。");
    }
  };

  // コメント削除
  const handleCommentDelete = async (commentId) => {
    if (!confirm("本当にこのコメントを削除しますか？")) return;

    try {
      await fetchAPI(`${API_URL}/events/${eventId}/comments/${commentId}`, { method: "DELETE" });

      // 削除後にコメント一覧を更新
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      alert("コメントが削除されました。");
    } catch (error) {
      alert("コメントの削除に失敗しました。");
      console.error(error);
    }
  };


  // ユーザー削除
  const handleUserDelete = async (userId) => {
    if (!confirm("本当にこのユーザーを削除しますか？")) return;

    try {
      await fetchAPI(`${API_URL}/users/${userId}`, { method: "DELETE" });
      alert("ユーザーが削除されました。");
    } catch (error) {
      alert("ユーザーの削除に失敗しました。");
    }
  };

  return { handleEventDelete, handleCommentDelete, handleUserDelete };
};

export default useHandleDelete;