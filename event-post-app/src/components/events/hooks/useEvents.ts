import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { authAtom } from '@/atoms/authAtom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const useEvents = () => {
  const [auth] = useAtom(authAtom);
  const currentUser = auth.currentUser;
  const currentUserFromHook = useCurrentUser();

  const router = useRouter();
  const defaultEventImage = '/image.svg';
  const defaultUserImage = '/user.svg';

  return {
    currentUser,
    currentUserFromHook,
    router,
    defaultEventImage,
    defaultUserImage,
  };
};
