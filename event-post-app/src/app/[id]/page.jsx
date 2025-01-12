"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";

export default function EventShow() {
  const [data, setData] = useState(null);
  console.log(data);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const params = useParams(); // useParams() で取得
  const eventId = params?.id; // `params`オブジェクトから `id` を安全に取得

  useEffect(() => {
    if (!eventId) {
      setError("Invalid Event ID");
      return;
    }

    fetchCurrentUser();

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
        const eventData = await res.json();
        setData(eventData);

        const userRes = await fetch(`${API_URL}/users/${eventData.user_id}`);
        if (!userRes.ok) throw new Error(`Failed to fetch user: ${userRes.status}`);
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching event or user data:", error);
        setError(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}/comments`);
        if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
        const commentsData = await res.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
      }
    };

    fetchEvent();
    fetchComments();
  }, [eventId, API_URL]);

  const handleDelete = async () => {
    if (!confirm("本当にこのイベントを削除しますか？")) return;

    try {
      const authToken = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        alert("イベントが正常に削除されました。");
        router.push("/");
      } else {
        throw new Error("イベントの削除に失敗しました。");
      }
    } catch (error) {
      console.error("イベント削除エラー:", error);
      setError(error.message);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!confirm("本当にこのコメントを削除しますか？")) return;

    try {
      const authToken = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/events/${eventId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        alert("コメントが削除されました。");
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error("コメントの削除に失敗しました。");
      }
    } catch (error) {
      console.error("コメント削除エラー:", error);
      setError(error.message);
    }
  };

  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  if (error) return <div className="text-red-500 text-lg">エラー: {error}</div>;
  if (!data || !user) return <div className="text-gray-600">読み込み中...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold p-24">イベント詳細</h1>
      <div className="text-2xl">
        <p className="pb-8">タイトル: {data.title}</p>
        <p className="pb-8">日時: {data.date}</p>
        <p className="pb-8">場所: {data.location}</p>
        <div className="pb-8">
          <p>画像:</p>
          {data.image_url && (
            <Image
              src={data.image_url}
              alt="image"
              width={500}
              height={300}
              className="mb-6 shadow-md"
            />
          )}
        </div>
        <p className="pb-8">説明: {data.description}</p>
        <p className="pb-8">金額: {data.price}</p>
        <p className="pb-8">投稿者: {user.name}</p>
        <div className="flex flex-col items-center justify-center">
          {isCurrentUser && (
            <div className="flex flex-row w-full my-4">
              <Link href={`/${eventId}/edit`} className="inline-flex items-center justify-center py-2 px-4 text-center bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 mr-8"
              >
                Edit
              </Link>
              <button onClick={handleDelete} className="inline-flex items-center justify-center py-2 px-4 text-center bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 mr-8"
              >
                Delete
              </button>
            </div>
          )}
          <div className="flex flex-col bg-gray-200 w-full my-12 p-4">
            <Link href={`/${eventId}/comments`} className="btn bg-orange-400 mb-8">
              コメントを書く
            </Link>
            <h1 className="text-xl my-4">コメント一覧</h1>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <Link href={`/users/${comment.user.id}`}>
                    <span className="font-semibold">{comment.user.name}</span>: {comment.content}
                  </Link>
                  {currentUser && comment.user.id === currentUser.id && (
                    <button
                      onClick={() => handleCommentDelete(comment.id)}
                      className="btn bg-red-500"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">コメントはまだありません。</p>
            )}
          </div>
          <Link href="/" className="inline-flex items-center justify-center py-2 px-4 text-center bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 mr-8"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}