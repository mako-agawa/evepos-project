"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function EventShow({ params }) {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const eventId = params.id;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("token");
      if (authToken) {
        try {
          const res = await fetch(`${API_URL}/current_user`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
    };
    fetchCurrentUser();
  }, [API_URL]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const eventData = await res.json();
        setData(eventData);

        const userRes = await fetch(`${API_URL}/users/${eventData.user_id}`);
        if (!userRes.ok) throw new Error(`Failed to fetch user data: ${userRes.status}`);
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
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
        setError(error.message);
      }
    };

    fetchEvent();
    fetchComments();
  }, [eventId, API_URL]);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;
  
    try {
      const authToken = localStorage.getItem("token"); // トークンを取得
      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // トークンを追加
        },
      });
  
      if (res.ok) {
        alert("Event deleted successfully");
        router.push("/");
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = confirm("Are you sure you want to delete this comment?");
    if (!confirmed) return;

    try {
      const authToken = localStorage.getItem("token"); // トークンを取得
      const res = await fetch(`${API_URL}/events/${eventId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // トークンを追加
        },
      });

      if (res.ok) {
        alert("Comment deleted successfully");
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  if (error) return <div>Error: {error}</div>;
  if (!data || !user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold p-24">Event Details</h1>
      <div className="text-2xl">
        <p className="pb-8">タイトル: {data.title}</p>
        <p className="pb-8">日時: {data.date}</p>
        <p className="pb-8">場所: {data.location}</p>
        <p className="pb-8">画像: {data.image}</p>
        <p className="pb-8">説明: {data.description}</p>
        <p className="pb-8">金額: {data.price}</p>
        <p className="pb-8">投稿者: {user.name}</p>
       
        <div className="flex flex-col items-center justify-center">
          {isCurrentUser && (
            <div className="flex flex-row w-full my-4">
              <Link
                href={`/${eventId}/edit`}
                className="inline-flex items-center justify-center py-2 px-4 text-center bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 mr-8"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center py-2 px-4 text-center bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 mr-8"
              >
                Delete
              </button>
            </div>
          )}

          <div className="flex flex-col bg-gray-200 w-full my-12 p-4">
            <Link
              href={`/${eventId}/comments`}
              className="inline-flex items-center justify-center px-6 py-3 text-2xl text-white bg-orange-400 font-bold rounded-md shadow-md hover:bg-orange-500 hover:shadow-lg transition-all duration-300 mb-8"
            >
              コメントを書く
            </Link>
            <h1 className="text-xl my-4">コメント欄</h1>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between w-full p-1 bg-white rounded-md mb-4"
                >
                  <Link href={`/users/${comment.user.id}`} className="text-xl">
                    <span className="font-semibold">{comment.user.name}</span>: {comment.content}
                  </Link>
                  {currentUser && comment.user.id === currentUser.id && ( // コメント投稿者だけが削除可能
                    <button
                      onClick={() => handleCommentDelete(comment.id)}
                      className="inline-flex items-center justify-center py-2 px-4 text-center bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">コメントはまだありません。</p>
            )}
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center py-2 px-4 text-center bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 mr-8"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}