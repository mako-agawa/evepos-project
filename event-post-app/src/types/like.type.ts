import type { User } from '@/types/user.type';
import type { Event } from '@/types/event.type';

export interface Like {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  event: Event;
}
