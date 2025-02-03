"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

import { HeartIcon } from "@heroicons/react/outline";
export default function LikeButton({
  eventId,
  initialLiked = false,
  initialLikesCount = 0,
  currentUserId = null,
  disabled = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  console.log("liked", liked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (disabled) {
      console.warn("ログインしていないため、いいねできません。");
      return;
    }
    
    const method = liked ? "DELETE" : "POST";
    
    const url = liked 
      ? `${API_URL}/events/${eventId}/likes/${currentUserId}` 
      : `${API_URL}/events/${eventId}/likes`;

    try {
      const data = await fetchAPI(url, { method, cache: "no-cache" });
      setLiked(!liked);
      if (data && data.likes_count !== undefined) {
        setLikesCount(data.likes_count);
      } else {
        setLikesCount(prev => liked ? prev - 1 : prev + 1);  // 楽観的UI更新
      }
    } catch (error) {
      console.error("Error while liking/unliking:", error);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleLikeToggle}
        disabled={disabled}
        className={`rounded-full transition-colors duration-300 ${
          liked ? "text-orange-400"  : "text-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400"}`}
        aria-label="Like Button"
      >
        <HeartIcon className="w-5 h-5" />
      </button>
      <span className="text-xs">{likesCount} いいね</span>
    </div>
  );
}