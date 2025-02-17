"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import { Heart } from "lucide-react";
import Image from "next/image";

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
  const [likedUsers, setLikedUsers] = useState([]); 

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`);
        setLikesCount(data.length);
        setLikedUsers(data.map(like => like.user).filter(Boolean)); 

        if (!currentUserId) return;

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
      await handleUnlike();
    } else {
      await handleLike();
    }
  };

  const handleLike = async () => {
    try {
      const data = await fetchAPI(`${API_URL}/events/${eventId}/likes`, {
        method: "POST",
        cache: "no-cache",
      });
      console.log(data);
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setCurrentUserLike(data);
      
      if (data.user) {
        setLikedUsers((prev) => [...prev, data.user]); // `null` でないことを確認
      }
    } catch (error) {
      console.error("Error while liking:", error);
    }
  };

  const handleUnlike = async () => {
    if (!currentUserLike) return;
    try {
      await fetchAPI(`${API_URL}/events/${eventId}/likes/${currentUserLike.id}`, {
        method: "DELETE",
        cache: "no-cache",
      });

      setLiked(false);
      setLikesCount((prev) => Math.max(prev - 1, 0));
      setCurrentUserLike(null);
      setLikedUsers((prev) => prev.filter(user => user.id !== currentUserId)); 
    } catch (error) {
      console.error("Error while unliking:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* いいねしたユーザーのサムネイル表示 */}
      <div className="flex -space-x-2">
        {likedUsers.length > 0 &&
          likedUsers.map((user) => (
            <Image
              key={user?.id}
              src={user?.thumbnail_url || "/user.svg"}
              alt={user?.name || "User"}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full border border-gray-400"
            />
          ))}
      </div>

      {/* いいねボタン */}
      <button
        onClick={handleLikeToggle}
        className={`rounded-full transition-colors duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:text-orange-400"
        }`}
        aria-label="Like Button"
      >
        <Heart
          className={`w-6 h-6 ${liked ? "text-orange-400 fill-orange-400" : "text-gray-400 fill-none"}`}
        />
      </button>
      <span className="text-xs">{likesCount} いいね</span>
    </div>
  );
}