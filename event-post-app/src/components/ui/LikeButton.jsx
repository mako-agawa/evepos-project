"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import Image from "next/image"; // Next.js の画像最適化を利用

export default function LikeButton({
  eventId,
  initialLiked = false,
  initialLikesCount = 0,
  currentUserId,
  disabled = false,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [currentUserLike, setCurrentUserLike] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔹 initialLiked の変更があった場合に、最新の liked 状態を反映
  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    const fetchLikes = async () => {

      try {
        const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`);
        setLikesCount(data.length);
        if (!currentUserId) {
          return
        }
        const currentUserLike = data.find((like) => like.user_id === currentUserId);
        if (currentUserLike) {
          setLiked(true);
          setCurrentUserLike(currentUserLike);
        }
      } catch (error) {
        console.error("Error while fetching likes:", error);
      }
    }
    fetchLikes();
  }, [eventId, currentUserId]);


  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (disabled) {
      window.alert("ログインしていないため、いいねできません。");
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
        const data = await fetchAPI(`${API_URL}/events/${eventId}/likes/${currentUserLike.id}`, {
          method: "DELETE",
          cache: "no-cache",
        });
        setLiked(false);
        setLikesCount((prev) => prev - 1);
        setCurrentUserLike(null);
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
        className={`rounded-full transition-colors duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400"
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