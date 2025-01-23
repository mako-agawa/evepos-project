import { useState, useEffect } from "react";
import { fetchAPI } from "@/utils/api";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/current_user`);
        setCurrentUser(data);
      } catch (error) {
        console.error("Failed to fetch current user", error);
      }
    };

    fetchUser();
  }, []);

  return { currentUser };
}