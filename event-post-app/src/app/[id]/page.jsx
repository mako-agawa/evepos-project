"use client";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation"; // useRouterを使う

// 非同期の params を unwrap する
export default function EventShow({ params }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // 非同期にparamsをアンラップ
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${eventId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setData(data);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold p-24">Event Details</h1>
      <div className="text-2xl">
        <p className="pb-8">タイトル: {data.title}</p>
        <p className="pb-8">日時: {data.date}</p>
        <p className="pb-8">場所: {data.location}</p>
        <p className="pb-8">場所: {data.image}</p>
        <p className="pb-8">説明: {data.description}</p>
        <p className="pb-8">金額: {data.price}</p>
        <p className="pb-8">ユーザーID: {data.user_id}</p>
        <div className="flex flex-col">
          <Link href={`/${eventId}/edit`} className="text-yellow-600 hover:cursor">Edit</Link>
          <Link href="/" className="text-green-700 hover:cursor">Back</Link>
          <button onClick={handleDelete} className="text-red-600 hover:cursor mt-4">Delete</button>
        </div>
      </div>
    </div>
  );
}