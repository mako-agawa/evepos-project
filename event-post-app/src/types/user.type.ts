export interface User {
  id: number;
  name: string;
  email: string;
  description?: string | null;
  thumbnail_url?: string | null;
}
