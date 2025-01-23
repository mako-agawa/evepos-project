import { fetchAPI } from "@/utils/api";

const useHandleDelete = (API_URL, eventId, comments, setComments) => {
  const handleEventDelete = async () => {
    if (!confirm("本当にこのイベントを削除しますか？")) return;

    try {
      await fetchAPI(`${API_URL}/events/${eventId}`, { method: "DELETE" });
      alert("イベントが削除されました。");
      window.location.href = "/";  // トップページへ遷移
    } catch (error) {
      alert("イベントの削除に失敗しました。");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!confirm("本当にこのコメントを削除しますか？")) return;

    try {
      await fetchAPI(`${API_URL}/events/${eventId}/comments/${commentId}`, { method: "DELETE" });
      setComments(comments.filter((comment) => comment.id !== commentId));
      alert("コメントが削除されました。");
    } catch (error) {
      alert("コメントの削除に失敗しました。");
    }
  };

  return { handleEventDelete, handleCommentDelete };
};

export default useHandleDelete;