"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import Image from "next/image"; // Next.js の画像最適化を利用

export default function LikeButton({
  eventId,
  initialLiked = false,
  initialLikesCount = 0,
  currentUserId = null,
  disabled = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔹 initialLiked の変更があった場合に、最新の liked 状態を反映
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (disabled) {
      console.warn("ログインしていないため、いいねできません。");
      return;
    }
    
  // 🔹 いいねの追加処理
    const handkeLike = async () => {
      try {
        const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`, {
          method: "POST",
          cache: "no-cache",
        });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error while liking:", error);
      }
    }

  // 🔹 いいねの削除処理
    const handkeUnlike = async () => { 
      try {
        const data = await fetchAPI(`${API_URL}/events/${eventId}/likes/${currentUserId}`, {
          method: "DELETE",
          cache: "no-cache",
        });
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } catch (error) {
        console.error("Error while unliking:", error);
      }
    }

    if (liked) {
      handkeUnlike();
    } else {
      handkeLike();
    }

  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleLikeToggle}
        disabled={disabled}
        className={`rounded-full transition-colors duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400"
        }`}
        aria-label="Like Button"
      >
        <Image
          src={liked ? "/heart-filled.svg" : "/heart-outline.svg"}
          alt="Like"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>
      <span className="text-xs">{likesCount} いいね</span>
    </div>
  );
}