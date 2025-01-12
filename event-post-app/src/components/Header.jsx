'use client';

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';

const Header = () => {
  const { currentUser } = useCurrentUser();
  const [auth] = useAtom(authAtom);

  return (
    <div className="flex justify-between items-center bg-orange-400 h-20 px-24">
      <Link
        href="/"
        className="text-white text-3xl font-bold hover:cursor"
      >
        いべぽす
      </Link>
      <div>
        {auth.isLoggedIn && currentUser ? (
          <>
            <Link
              href={`/users/${currentUser.id}`}
              className="text-white text-xl pr-8 font-bold hover:cursor"
            >
              {currentUser.name} さん
            </Link>
            <Link
              href="/users"
              className="text-white text-xl pr-8 font-bold hover:cursor"
            >
              ユーザー管理
            </Link>
            <Link
              href="/logout"
              className="text-white text-xl pr-8 font-bold hover:cursor"
            >
              ログアウト
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="text-white text-xl pr-8 font-bold hover:cursor"
          >
            ログイン
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;