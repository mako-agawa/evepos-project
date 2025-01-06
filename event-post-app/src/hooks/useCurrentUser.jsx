"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { AUTH_STORAGE_KEY, authAtom, TOKEN_STORAGE_KEY } from "@/atoms/authAtom";

export function useCurrentUser() {
  const [auth, setAuth] = useAtom(authAtom);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const authToken = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/current_user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Unauthorized');
      const userData = await response.json();
      setAuth({
        currentUser: userData,
        isLoggedIn: true,
      });
    };

    fetchCurrentUser();
  }, [setAuth, API_URL]); // authを依存関係から削除

  return { currentUser: auth.currentUser, isLoggedIn: auth.isLoggedIn };
}
