"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserShow({ params }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // ログイン中のユーザー情報
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const userId = params.id; // paramsからユーザーIDを取得

  // ログイン中のユーザー情報を取得
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
            setCurrentUser(userData); // ログイン中のユーザー情報を設定
          }
        } catch (error) {
          console.error("Failed to fetch current user:", error);
        }
      }
    };

    fetchCurrentUser();  
  }, [API_URL]);

  // 表示するユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [userId, API_URL]);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // 認証トークンを設定
        },
      });

      if (res.ok) {
        alert("User deleted successfully");
        router.push("/users");
      } else {
        throw new Error("Failed to delete user");
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

  // currentUserと表示中のユーザーが一致するかを確認
  const isCurrentUser = currentUser && currentUser.id === data.id;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold py-24">{isCurrentUser ? "マイページ" : "ユーザーページ"}</h1>
      <div className="text-2xl">
        <p>Name: {data.name}</p>
        <p className="pb-12">Email: {data.email}</p>
        <p className="pb-12">Description: {data.description}</p>
        {isCurrentUser && (
          <div className="flex flex-row w-full my-4">
            <Link href={`/users/${userId}/edit`} className="inline-flex items-center justify-center py-2 px-4 text-center bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 mr-8">
              Edit
            </Link>
            <button onClick={handleDelete} className="inline-flex items-center justify-center py-2 px-4 text-center bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300 mr-8">
              Delete
            </button>
          </div>
        )}
        <Link href="/users" className="inline-flex items-center justify-center py-2 px-4 text-center bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 mr-8">
          Back
        </Link>
      </div>
    </div>
  );
}