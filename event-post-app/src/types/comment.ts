import type { User } from '@/types/user';
import type { Event } from '@/types/event';

interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  event: Event;
}
