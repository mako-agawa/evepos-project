"use client";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function UserShow({ params }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // 非同期にparamsをアンラップ
  const resolvedParams = use(params);
  const userId = resolvedParams.id; // 解決したparamsオブジェクトからidを取得

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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold py-24">User Page</h1>
      <div className="text-2xl">
        <p>Name: {data.name}</p>
        <p className="pb-12">Email: {data.email}</p>
        <p className="pb-12">Description: {data.description}</p>
        <div className="flex flex-row w-full my-4">
          <Link href={`/users/${userId}/edit`} className="text-yellow-600 pr-8 hover:cursor">
            Edit
          </Link>
          <button onClick={handleDelete} className="text-red-600 hover:cursor">
            Delete
          </button>
        </div>
        <Link href="/users" className="text-green-700 hover:cursor">
          Back
        </Link>
      </div>
    </div>
  );
}