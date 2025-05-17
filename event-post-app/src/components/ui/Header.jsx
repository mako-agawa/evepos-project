'use client';

import Link from "next/link";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAtom } from 'jotai';
import { authAtom, pageModeAtom } from '@/atoms/authAtom';
import { X } from "lucide-react";
import { Button } from "@/styles/button";
import usePageNavigation from "@/hooks/usePageNavigation";
import Image from "next/image";
import defaultUserImage from '/public/user.svg';

const Header = () => {
  const { currentUser } = useCurrentUser();
  const [auth] = useAtom(authAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleNavigation } = usePageNavigation();
  const [, setPageMode] = useAtom(pageModeAtom);

  const handlePushLogin = () => {
    setPageMode("login");
    setMenuOpen(false);
  };

  return (
    <header className="bg-orange-400 py-4 pl-5 pr-6 border-b border-gray-300 shadow-md sm:px-24 flex justify-between items-center">
      {/* ロゴ */}
      <Link href="/" onClick={() => handleNavigation("index")} className="text-white text-3xl font-bold">
        evepos
      </Link>

      {/* モバイル版ハンバーガーメニュー */}
      <div className="sm:hidden  relative">
        {/* ログイン状態に応じてアイコン or ログインボタンを表示 */}
        {auth.isLoggedIn && currentUser ? (
          <Image
            src={currentUser.thumbnail_url || defaultUserImage}
            alt={currentUser.name}
            width={48}
            height={48}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full border object-cover border-gray-200 cursor-pointer shadow-md"
          />
        ) : (
          <Link
            href="/login"
            className="text-lg font-bold text-white hover:text-gray-100"
            onClick={handlePushLogin}
          >
            ログイン
          </Link>
        )}

        {/* メニュー表示 */}
        {menuOpen && (
          <div className="absolute right-0 top-0 w-48 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col items-center">
            <nav className="flex flex-col items-center py-2 w-full">
              {auth.isLoggedIn && currentUser && (
                <div className="flex flex-col items-center w-full">
                  {/* プロフィールリンク */}
                  <Link
                    href={`/users/${currentUser.id}`}
                    className="flex flex-row items-center justify-center font-bold px-4 py-2 hover:bg-gray-100 w-full text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Image
                      src={currentUser.thumbnail_url || defaultUserImage}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border object-cover border-orange-400 mr-2"
                    />
                    {currentUser.name} さん
                  </Link>

                  {/* ログアウトボタン */}
                  <Link
                    href="/logout"
                    className="font-bold px-4 py-2 hover:bg-gray-100 w-full text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    ログアウト
                  </Link>
                </div>
              )}
            </nav>

            {/* 閉じるボタン */}
            <Button
              variant="ghost"
              className="w-full py-2 border-t border-gray-300"
              onClick={() => setMenuOpen(false)}
            >
              <X className="w-5 h-5 mr-1" />
              閉じる
            </Button>
          </div>
        )}
      </div>

      {/* デスクトップ版メニュー */}
      <nav className="hidden sm:flex space-x-8">
        {auth.isLoggedIn && currentUser ? (
          <>
            <Link href={`/users/${currentUser.id}`} className="text-white text-xl font-bold hover:cursor">
              {currentUser.name} さん
            </Link>

            <Link href="/logout" className="text-white text-xl font-bold hover:cursor">
              ログアウト
            </Link>
          </>
        ) : (
          <Link
            href="/login"
            className="text-white text-xl font-bold hover:cursor"
            onClick={handlePushLogin}
          >
            ログイン
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;