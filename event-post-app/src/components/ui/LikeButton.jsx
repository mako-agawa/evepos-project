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
        className={`rounded-full ${
          liked
            ? "bg-orange-400 text-white hover:bg-orange-400"
            : "bg-gray-100 text-black hover:bg-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Like Button"
      >
        {/* ハートアイコン */}
        <Image src="/heart.svg" alt="Like"  width={25} height={25} />

      </button>
        {/* いいね数 (ハートの右上に重ねる) */}
        {/* {likesCount > 0 && ( */}
          <span className="ml-1 text-xs">
            {likesCount}いいね
          </span>
        {/* )} */}
    </div>
  );
}