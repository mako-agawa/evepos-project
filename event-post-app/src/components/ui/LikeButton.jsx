"use client";

import { useState } from "react";
import { fetchAPI } from "@/utils/api";
import { Heart } from "lucide-react";

export default function LikeButton({
  eventId,
  initialLiked = false,
  initialLikesCount = 0,
  disabled = false, // ★追加: ボタンを無効化するかどうか
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLike = async (e) => {
    e.stopPropagation(); // 親要素へのイベント伝播を防ぐ

    // ログインしていない場合はアクションしない（またはアラートなど）
    if (disabled) {
      console.warn("ログインしていないため、いいねできません。");
      return;
    }

    const method = liked ? "DELETE" : "POST";

    try {
      const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`, { method });
      setLiked(!liked);
      setLikesCount(data.likes_count);
    } catch (error) {
      console.error("Error while liking/unliking:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        disabled={disabled} // ★追加: ボタンを無効化
        className={`p-2 rounded-full transition-colors ${
          liked
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-300 text-black hover:bg-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Like Button"
      >
        <Heart className="w-3 h-3" />
      {/* <span className="text-sm">{likesCount}</span> */}
      </button>
    </div>
  );
}
