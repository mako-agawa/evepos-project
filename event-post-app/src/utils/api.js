export const fetchAPI = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  console.log(token);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = { headers, ...options };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null); // JSONに変換失敗をキャッチ
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request error:", error.message);
    throw error;
  }
};