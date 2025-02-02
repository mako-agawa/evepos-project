"use client";

import { cache, useEffect, useState } from "react";
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

    const method = liked ? "DELETE" : "POST";
    ////
    const previousLikedState = liked;
    const previousLikesCount = likesCount;

    // 楽観的UI更新: すぐにUIに反映
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    ////
    try {
      const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`, { method, cache: "no-cache" });
      console.log("data",);
      if (data && data.likes_count !== undefined) {
        setLikesCount(data.likes_count);
      }
    } catch (error) {
      console.error("Error while liking/unliking:", error);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`);
        console.log("data", data);
      } catch (error) {
        console.error("Error while liking/unliking:", error);
      }
    }
    fetchLikes();
  }, []);

  return (
    <div className="flex items-center">
      <button
        onClick={handleLike}
        disabled={disabled}
        className={`rounded-full transition-colors duration-300 ${liked ? "text-orange-400" : "text-gray-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400"}`}
        aria-label="Like Button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          className="size-6"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      </button>
      <span className="text-xs">
        {likesCount} いいね
      </span>
    </div>
  );
}
