"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EventShow({ params }) {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // ログイン中のユーザー情報
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const eventId = params.id;

  // ログイン中のユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const res = await fetch(`${API_URL}/current_user`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setCurrentUser(userData); // ログイン中のユーザー情報を設定
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
    };
    fetchCurrentUser();
  }, [API_URL]);

  // イベントと投稿者情報を取得
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const eventData = await res.json();
        setData(eventData);

        // 投稿者情報を取得
        const userRes = await fetch(`${API_URL}/users/${eventData.user_id}`);
        if (!userRes.ok) {
          throw new Error(`Failed to fetch user data: ${userRes.status}`);
        }
        const userData = await userRes.json();
        setUser(userData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvent();
  }, [eventId, API_URL]);

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('Event deleted successfully');
        router.push('/'); // ユーザー削除後にリダイレクト
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // 現在のユーザーが投稿者かどうかを確認
  const isCurrentUser = currentUser && user && currentUser.id === user.id;

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-24">Event Details</h1>
      <div className="text-2xl">
        <p className="pb-8">タイトル: {data.title}</p>
        <p className="pb-8">日時: {data.date}</p>
        <p className="pb-8">場所: {data.location}</p>
        <p className="pb-8">画像: {data.image}</p>
        <p className="pb-8">説明: {data.description}</p>
        <p className="pb-8">金額: {data.price}</p>
        <p className="pb-8">投稿者: {user.name}</p>
        <div className="flex flex-col">
          {isCurrentUser && (
            <div className="flex flex-row w-full my-4">
              <Link href={`${eventId}/edit`} className="inline-flex items-center justify-center py-2 px-4 text-center bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 mr-8">
                Edit
              </Link>
              <button onClick={handleDelete} className="inline-flex items-center justify-center py-2 px-4 text-center bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 mr-8">
                Delete
              </button>
            </div>
          )}
          <Link href="/" className="inline-flex items-center justify-center py-2 px-4 text-center bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 mr-8">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}