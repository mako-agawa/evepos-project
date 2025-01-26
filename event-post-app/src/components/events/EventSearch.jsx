import React from "react";
import { Search } from "lucide-react";

const EventSearch = () => {
  return (
    <div className="flex flex-col items-center h-screen px-4 py-8">
      {/* ロゴ */}
      <h1 className="text-4xl font-bold text-gray-800 mb-14">Event Search</h1>

      {/* 検索バー */}
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          placeholder="イベントを検索..."
          className="w-full px-5 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <Search className="absolute right-5 top-4 text-gray-500 w-6 h-6" />
      </div>

      {/* ボタン */}
      <div className="flex gap-4 mt-6">
        <button className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition">
          イベント検索
        </button>
        <button className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition">
          ランダムイベント
        </button>
      </div>

      {/* フッター */}
      <div className="flex flex-col items-center absolute bottom-10 text-gray-600 text-sm">
        <p className="text-gray-400 text-2xl">現在開発中</p>
      </div>
    </div>
  );
};

export default EventSearch;