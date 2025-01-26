import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { fetchAPI } from "@/utils/api";
import { authAtom } from "@/atoms/authAtom";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [auth, setAuth] = useAtom(authAtom);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.token) return;  // トークンがない場合は何もしない
      try {
        const data = await fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/current_user`, {
          headers: {
            Authorization: `Bearer ${auth.token}`, // トークンをヘッダーに追加
          },
        });
        setCurrentUser(data);

        // 認証状態を更新（既存の値に currentUser を追加）
        setAuth((prevAuth) => ({ ...prevAuth, currentUser: data }));
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchUser();
  }, [auth.token]);  // トークンの変更時のみ実行

  return { currentUser };
}