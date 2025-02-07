"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import { Heart } from "lucide-react";

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
          return;
        }
        const userLike = data.find((like) => like.user_id === currentUserId);
        if (userLike) {
          setLiked(true);
          setCurrentUserLike(userLike);
        } else {
          setLiked(false);
          setCurrentUserLike(null);
        }
      } catch (error) {
        console.error("Error while fetching likes:", error);
      }
    };
    fetchLikes();
  }, [eventId, currentUserId]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (disabled) {
      window.alert("ログインしていないため、いいねできません。");
      return;
    }

    if (liked && currentUserLike) {
      handleUnlike();
    } else {
      handleLike();
    }
  };

  // 🔹 いいねの追加処理
  const handleLike = async () => {
    try {
      const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`, {
        method: "POST",
        cache: "no-cache",
      });
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setCurrentUserLike(data); // ← ここで `currentUserLike` を更新
    } catch (error) {
      console.error("Error while liking:", error);
    }
  };

  // 🔹 いいねの削除処理
  const handleUnlike = async () => {
    if (!currentUserLike) return; // currentUserLike がない場合は処理しない
    try {
      await fetchAPI(`${API_URL}/events/${eventId}/likes/${currentUserLike.id}`, {
        method: "DELETE",
        cache: "no-cache",
      });
      setLiked(false);
      setLikesCount((prev) => Math.max(prev - 1, 0));
      setCurrentUserLike(null); // ← `currentUserLike` をリセット
    } catch (error) {
      console.error("Error while unliking:", error);
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
        <Heart
          size={24}
          className={`w-6 h-6 ${liked ? "text-orange-400 fill-orange-400" : "text-gray-400 fill-none"}`}
        />
      </button>
      <span className="text-xs">{likesCount} いいね</span>
    </div>
  );
}