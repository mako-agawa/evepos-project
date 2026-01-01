// 開発環境と本番環境で切り替えられるように定義（とりあえず今は直書きでOK）
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const fetchAPI = async (
  path: string, // url ではなく path に名前変更（誤解を防ぐため）
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // トークンが存在する場合のみAuthorizationヘッダーを追加
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };
  // 例: http://localhost:3000/api/v1 + /users
  const fullUrl = `${BASE_URL}${path}`;
  try {
    const response = await fetch(fullUrl, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('API request error:', error.message);
    throw error;
  }
};