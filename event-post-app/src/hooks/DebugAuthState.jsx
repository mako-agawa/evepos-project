import { useAtom } from 'jotai';
import { authAtom } from '../atoms/authAtom';
import { useEffect } from 'react';

export const DebugAuthState = () => {
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    console.log("Current auth state:", auth);
  }, [auth]);

  return null;
};