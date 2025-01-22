'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";
import Link from "next/link";

export default function UserShow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useCurrentUser();
  const [auth] = useAtom(authAtom);
  const params = useParams();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const userId = params.id;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const userData = await res.json();
        setData(userData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // currentUserが読み込まれるまで待機
  // useEffect(() => {
  //   if (auth && !auth.isLoggedIn) {
  //     router.push('/login');
  //   }
  // }, [auth, router]);

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  // currentUserとdataの両方が存在する場合のみisCurrentUserを計算
  console.log(currentUser);
  console.log(data); 
  console.log(auth); 
  
  const isCurrentUser = currentUser && data;
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold py-24">{isCurrentUser ? "マイページ" : "ユーザーページ"}</h1>
      <div className="text-2xl flex flex-col items-center">
        {data.thumbnail_url && (
          <img
            src={data.thumbnail_url}
            alt="User Thumbnail"
            className="w-24 h-24 rounded-full mb-6 shadow-md"
          />
        )}
        <p>Name: {data.name}</p>
        <p className="pb-12">Email: {data.email}</p>
        <p className="pb-12">Description: {data.description}</p>
        {isCurrentUser && (
          <div className="flex flex-row w-full my-4">

            <Link
              href={`/users/${userId}/edit`}
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
        <Link
          href="/users"
          className="inline-flex items-center justify-center py-2 px-4 text-center bg-gray-400 text-white rounded-md shadow-md hover:bg-gray-500 hover:shadow-lg transition-all duration-300 mr-8"
        >
          Back
        </Link>
      </div>
    </div>
  );
}