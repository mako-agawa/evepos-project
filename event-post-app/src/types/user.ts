export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    description?: string;
    thumbnail_url?: string;
    // 必要に応じて他のプロパティも追加
  }