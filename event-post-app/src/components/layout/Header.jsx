'use client';

import Link from "next/link";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAtom } from 'jotai';
import { authAtom } from '@/atoms/authAtom';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePageNavigation from "@/hooks/usePageNavigation";
import Image from "next/image";

const Header = () => {
  const { currentUser } = useCurrentUser();
  console.log(currentUser);
  const [auth] = useAtom(authAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleNavigation } = usePageNavigation();

  return (
    <header className="bg-orange-400 h-20 px-4 sm:px-24 flex justify-between items-center relative">
      <Link href="/" onClick={() => handleNavigation("index")} className="text-white text-3xl font-bold hover:cursor">
        いべぽす
      </Link>

      {/* ハンバーガーメニュー (モバイルサイズ) */}
      <div className="sm:hidden relative">
        <Button
          variant="ghost"
          className="text-white w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-8 h-8" />
        </Button>

        {menuOpen && (
          <div className="absolute right-0 top-0 w-48 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col items-center">
            <nav className="flex flex-col items-center py-2 w-full">
              {auth.isLoggedIn && currentUser ? (
                <div className="flex flex-col items-center w-full">
                  <Link
                    href={`/users/${currentUser.id}`}
                    className="flex flex-row items-center justify-center text-gray-700 text-lg font-bold px-4 py-2 hover:bg-gray-100 w-full text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Image
                      src={currentUser.thumbnail_url || "/default-avatar.png"}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-300 mr-2"
                    />
                    {currentUser.name} さん
                  </Link>

                  <Link
                    href="/logout"
                    className="text-gray-700 text-lg font-bold px-4 py-2 hover:bg-gray-100 w-full text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    ログアウト
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 text-lg font-bold px-4 py-2 hover:bg-gray-100 w-full text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  ログイン
                </Link>
              )}
            </nav>
            <Button
              variant="ghost"
              className="text-gray-700 w-8 h-8 py-2 mb-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <X className="w-8 h-8" />close
            </Button>
          </div>
        )}
      </div>

      {/* メニュー項目 (デスクトップ) */}
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
          <Link href="/login" className="text-white text-xl font-bold hover:cursor">
            ログイン
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;