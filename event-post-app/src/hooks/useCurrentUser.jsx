"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";

export function useCurrentUser() {
  const [auth, setAuth] = useAtom(authAtom);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // `fetchCurrentUser`を返す
  const fetchCurrentUser = async () => {
    const authToken = localStorage.getItem("token"); // トークンを取得
    if (!authToken) {
      console.error("トークンが見つかりません");
      return null;
    }

    const response = await fetch(`${API_URL}/current_user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Unauthorized");
      return null;
    }

    const userData = await response.json();
    setAuth({
      currentUser: userData,
      isLoggedIn: true,
    });

    return userData; // 呼び出し元で使用するため返却
  };

  // 初期化時に自動で呼び出し
  useEffect(() => {
    fetchCurrentUser();
  }, [setAuth, API_URL]);

  return { currentUser: auth.currentUser, isLoggedIn: auth.isLoggedIn, fetchCurrentUser };
}