import type { User } from '@/types/user';
import type { Event } from '@/types/event';

export interface Like {
  id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  event: Event;
}
