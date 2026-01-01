'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/utils/fetchAPI';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { User } from '@/types/user.type';
import type { Like } from '@/types/like.type';

interface LikeButtonProps {
  eventId: number;
  initialLiked?: boolean;
  initialLikesCount?: number;
  currentUserId?: number;
  disabled?: boolean;
}

export default function LikeButton({
  eventId,
  initialLiked = false,
  initialLikesCount = 0,
  currentUserId,
  disabled = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
  const [currentUserLike, setCurrentUserLike] = useState<Like | null>(null);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);

  const router = useRouter();

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data: Like[] = await fetchAPI(
          `/events/${eventId}/likes`
        );
        setLikesCount(data.length);
        setLikedUsers(data.map((like) => like.user).filter(Boolean));

        if (!currentUserId) return;

        const userLike = data.find((like) => like.user.id === currentUserId);
        //
        if (userLike) {
          setLiked(true);
          setCurrentUserLike(userLike);
        } else {
          setLiked(false);
          setCurrentUserLike(null);
        }
      } catch (error) {
        console.error('Error while fetching likes:', error);
      }
    };
    fetchLikes();
  }, [eventId, currentUserId]);

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) {
      window.alert('ログインしていないため、いいねできません。');
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
      const data: Like = await fetchAPI(`/events/${eventId}/likes`, {
        method: 'POST',
        cache: 'no-cache',
      });

      setLiked(true);
      setLikesCount((prev) => prev + 1);
      setCurrentUserLike(data);

      if (data.user) {
        setLikedUsers((prev) => [...prev, data.user]); // `null` でないことを確認
      }
    } catch (error) {
      console.error('Error while liking:', error);
    }
  };

  const handleUnlike = async () => {
    if (!currentUserLike) return;
    try {
      await fetchAPI(
        `/events/${eventId}/likes/${currentUserLike.id}`,
        {
          method: 'DELETE',
          cache: 'no-cache',
        }
      );

      setLiked(false);
      setLikesCount((prev) => Math.max(prev - 1, 0));
      setCurrentUserLike(null);
      setLikedUsers((prev) => prev.filter((user) => user.id !== currentUserId));
    } catch (error) {
      console.error('Error while unliking:', error);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {/* いいねしたユーザーのサムネイル表示 */}
      <div
        onClick={() => router.push(`/events/${eventId}/liked`)}
        className="flex -space-x-2"
      >
        {likedUsers.length > 0 &&
          likedUsers.slice(0, 5).map(
            (
              user // 5人までに制限
            ) => (
              <Image
                key={user?.id}
                src={user?.thumbnail_url || '/user.svg'}
                alt={user?.name || 'User'}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border object-cover border-gray-400"
              />
            )
          )}
      </div>

      {/* いいねボタン */}
      <button
        onClick={handleLikeToggle}
        className={`rounded-full transition-colors duration-300 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-orange-400'
        }`}
        aria-label="Like Button"
      >
        <Heart
          className={`w-6 h-6 ${liked ? 'text-orange-400 fill-orange-400' : 'text-gray-400 fill-none'}`}
        />
      </button>
      <span className="text-s font-bold text-gray-400">{likesCount}</span>
    </div>
  );
}
