import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { authAtom } from '@/atoms/authAtom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import defaultEventImage from '/public/image.svg';
import defaultUserImage from '/public/user.svg';


export const useEvents = () => {
  const [auth] = useAtom(authAtom);
  const currentUser = auth.currentUser;
  const currentUserFromHook = useCurrentUser();
  
  const router = useRouter();
  


  return {
    currentUser,
    currentUserFromHook,
    router,
    defaultEventImage,
    defaultUserImage, 
   
  };
};