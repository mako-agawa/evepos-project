'use client';

import { useState } from 'react';

const LikeButton = ({ eventId, initialLiked, initialLikesCount }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLike = async () => {
    try {
      const authToken = localStorage.getItem('token'); // 認証トークンを取得
      const response = await fetch(`${API_URL}/events/${eventId}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(!liked);
        setLikesCount(data.likes_count); // サーバーから最新の「いいね」数を取得
      } else {
        console.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error while liking/unliking:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded ${
          liked ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'
        }`}
      >
        {liked ? 'いいね解除' : 'いいね'}
      </button>
      <span>{likesCount} いいね</span>
    </div>
  );
};

export default LikeButton;