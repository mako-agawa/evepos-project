// src/utils/fetchAPI.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const fetchAPI = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // FormData判定
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const fullUrl = `${BASE_URL}${path}`;

  try {
    const response = await fetch(fullUrl, config);
    
    // ▼▼▼ ここを修正：エラーメッセージを賢く取得する ▼▼▼
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      
      // Railsのエラー形式 (errors: ["..."]) に対応
      const errorMessage = 
        errorData?.errors?.join(', ') || // 配列なら連結
        errorData?.message ||            // 単体メッセージならそれを使う
        `Error: ${response.status}`;     // なければステータスコード
        
      throw new Error(errorMessage);
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    return await response.json() as T;

  } catch (error: any) {
    console.error('API request error:', error.message);
    throw error;
  }
};