export const fetchAPI = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null); // JSONに変換失敗をキャッチ
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error('API request error:', error.message);
    throw error;
  }
};

//　APIフォルダに置く