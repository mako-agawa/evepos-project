import type { User } from "@/types/user";

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  image_url?: string;
  createdAt: string;
  updatedAt: string;
  user: User; 
}