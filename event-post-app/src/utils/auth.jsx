// utils/auth.js
import { currentUserAtom } from '@/atoms/currentUserAtom'; 
import { useSetAtom } from 'jotai';

export const fetchCurrentUser = async (setUser) => {
  try {
    const response = await fetch('http://localhost:3001/api/v1/current_user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      const user = await response.json();
      setUser(user);
    }
  } catch (error) {
    console.error('Failed to fetch current user:', error);
  }
};