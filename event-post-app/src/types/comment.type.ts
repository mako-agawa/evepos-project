import type { User } from '@/types/user.type';
import type { Event } from '@/types/event.type';

interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  event: Event;
}
