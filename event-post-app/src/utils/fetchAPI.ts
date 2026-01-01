// 開発環境と本番環境で切り替えられるように定義
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// <T> を追加してジェネリクス関数にする
export const fetchAPI = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => { // 戻り値を Promise<T> に指定
  
  // トークンの取得（Next.jsなどのSSR環境を考慮して window チェックを入れるのが安全です）
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
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
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    // ここで JSON を T 型として返します
    return await response.json() as T;

  } catch (error: any) {
    console.error('API request error:', error.message);
    throw error;
  }
};