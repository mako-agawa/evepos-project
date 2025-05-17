"use client";

import Link from "next/link";
import { HomeIcon, CalendarIcon, SearchIcon, PlusCircleIcon, LogInIcon } from "lucide-react";
import usePageNavigation from "@/hooks/usePageNavigation";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { handleNavigation, getActiveClass } = usePageNavigation();
  const [auth] = useAtom(authAtom);
  const [isClient, setIsClient] = useState(false);
  // クライアントサイドでのみレンダリングするフラグを設定
  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentUser = auth.currentUser;

  // クライアントサイドでのみレンダリング
  if (!isClient) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md">
      <div className="flex justify-around max-w-screen-md mx-auto items-center py-3">

        {/* 新着イベント */}
        <button onClick={() => handleNavigation("index")}>
          <Link href="/" className={`flex flex-col items-center ${getActiveClass("index")} hover:text-orange-400`}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">新着</span>
          </Link>
        </button>

        {/* スケジュール */}
        <button onClick={() => handleNavigation("schedule")}>
          <Link href="/" className={`flex flex-col items-center ${getActiveClass("schedule")} hover:text-orange-400`}>
            <CalendarIcon className="w-6 h-6" />
            <span className="text-xs mt-1">スケジュール</span>
          </Link>
        </button>

        {/* 検索 */}
        <button onClick={() => handleNavigation("search")}>
          <Link href="/" className={`flex flex-col items-center ${getActiveClass("search")} hover:text-orange-400`}>
            <SearchIcon className="w-6 h-6" />
            <span className="text-xs mt-1">検索</span>
          </Link>
        </button>

        {/* 新規作成 or ログイン */}
        {auth.isLoggedIn && currentUser ? (
          <button onClick={() => handleNavigation("create")}>
            <Link href="/events/new" className={`flex flex-col items-center ${getActiveClass("create")} hover:text-orange-400`}>
              <PlusCircleIcon className="w-6 h-6" />
              <span className="text-xs mt-1">新規作成</span>
            </Link>
          </button>
        ) : (
          <button onClick={() => handleNavigation("login")}>
            <Link href="/users/login" className={`flex flex-col items-center ${getActiveClass("login")} hover:text-orange-400`}>
              <LogInIcon className="w-6 h-6" />
              <span className="text-xs mt-1">ログイン</span>
            </Link>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;