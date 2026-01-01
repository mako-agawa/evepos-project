import type { User } from '@/types/user.type';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  price: string;
  liked: boolean;
  likes_count: number;
  image_url?: string; // Optional, if you want to include an image URL
  user: User;
}

