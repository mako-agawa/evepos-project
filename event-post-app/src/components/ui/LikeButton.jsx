"use client";

import { useState } from "react";
import { fetchAPI } from "@/utils/api";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function LikeButton({
  eventId,
  initialLiked = false,
  initialLikesCount = 0,
  disabled = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLike = async (e) => {
    e.stopPropagation();
  
    if (disabled) {
      console.warn("ログインしていないため、いいねできません。");
      return;
    }
  
    const method = liked ? "DELETE" : "POST"; // いいね済みなら削除、未いいねなら追加
  
    try {
      const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`, { method });
      setLiked(!liked);
      setLikesCount(data.likes_count);
    } catch (error) {
      console.error("Error while liking/unliking:", error);
    }
  };

  return (
    <div className="flex items-center">
      {/* いいねボタン */}
      <button
        onClick={handleLike}
        disabled={disabled}
        className={`relative p-2 transition-colors ${
          liked
            ? "bg-orange-400 text-white hover:bg-orange-400"
            : "bg-gray-100 text-black hover:bg-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Like Button"
      >
        {/* ハートアイコン */}
        <Image src="/heart.svg" alt="Like" width={25} height={25} />

        {/* いいね数 (ハートの右上に重ねる) */}
        {likesCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs px-1 rounded-full shadow-md">
            {likesCount}
          </span>
        )}
      </button>
    </div>
  );
}