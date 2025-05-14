export interface User {
  id: number;
  name: string;
  email: string;
  description?: string;
  thumbnail_url?: string;
  // 必要に応じて他のプロパティも追加
  created_at: string;
  updated_at: string;
}
