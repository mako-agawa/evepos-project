"use client";
import { useEffect } from "react";
import { useState } from "react";

import { Search } from "lucide-react";
import { getURL } from "@/lib/utils";
import { getEventDate, getEventTime, getEventWeekday } from "../general/EventDateDisplay";
import Image from "next/image";
import { LocationMarkerIcon } from "@heroicons/react/outline";
import LikeButton from "../like/LikeButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAtom } from "jotai";
import { authAtom } from "@/atoms/authAtom";
import { useRouter } from "next/navigation";

const EventSearch = () => {
  const [auth] = useAtom(authAtom);
  const currentUser = auth.currentUser;
  // 🔹 ステートの初期化 キーワードを保持
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const events = searchResults
  console.log(events);
  const url = getURL();
  const [triggerSearch, setTriggerSearch] = useState(false);


  useEffect(() => {
    if (!triggerSearch) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/api/v1/events/search?query=${searchKeyword}`);
        const data = await response.json();
        // console.log(data);
        if (response.ok) {
          setSearchResults(data);
        } else {
          console.error("Error fetching data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTriggerSearch(false);
      }
    };

    fetchData();
  }, [triggerSearch, searchKeyword, url]);

  const handleSearchClick = () => {
    setTriggerSearch(true);
  };

  return (
    <>
      <div className="flex flex-col h-screen px-6">
        {/* ロゴ */}
        <h1 className="text-gray-400 border-b-2 border-orange-300 text-xl font-semibold mb-6">Search</h1>

        {/* 検索バー */}
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="イベントを検索..."
            className="w-full px-5 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <Search className="absolute right-5 top-4 text-gray-500 w-6 h-6" />
        </div>

        {/* ボタン */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSearchClick}
            className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            イベント検索
          </button>
        </div>

        <div className="w-full">
          {events.map((event) => {
            const isCreator = useCurrentUser && event.user_id === currentUser.id;
            const mmdd = getEventDate(event.date);
            const weekday = getEventWeekday(event.date);
            const hhmm = getEventTime(event.date)
            console.log(event);
            return (
              <div
                key={event.id}
                onClick={() => router.push(`/events/${event.id}`)}
                className="cursor-pointer flex flex-row mb-2 relative w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all py-3 px-3"
              >
                <div className="flex ml-2 gap-4">
                  {/* 画像のコンテナ（relative を適用） */}
                  <div className="relative w-[160px] h-[110px]">
                    <Image
                      src={event.image_url || defaultEventImage}
                      alt={event.title}
                      width={150}
                      height={150}
                      priority
                      className="object-cover shadow-sm rounded-md w-[160px] h-[110px]"
                    />
                    <div className="flex absolute bottom-0 right-0 text-xs bg-gray-200 opacity-90 p-1 rounded-md">
                      <LocationMarkerIcon className="w-4 h-4 text-orange-500" />
                      <p className="text-gray-600 font-semibold text-xs">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex w-[130px] flex-col">

                    {/* イベント詳細 */}
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col items-start w-full">

                        {/* タイトル & いいねボタン */}
                        <div className="flex items-center justify-between mt-1">
                          <h2
                            className="font-semibold  border-b border-gray-200 shadow-sm"
                          >
                            {event.title}
                          </h2>
                        </div>




                        {/* 投稿者情報 */}
                        <div className="flex mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Image
                              src={event.user.thumbnail_url || defaultUserImage}
                              alt={event.user.name}
                              width={24}
                              height={24}
                              priority
                              className="w-6 h-6 rounded-full object-cover border border-orange-400 mr-1"
                            />
                            <span>{event.user.name}</span>
                          </div>
                        </div>
                        {/* いいねボタンをオーバーレイ（absolute で右上） */}
                      </div>
                    </div>
                  </div>
                  <div className="flex absolute bottom-1 right-3 justify-end">
                    <LikeButton
                      eventId={event.id}
                      initialLiked={event.liked}  // APIから `liked` を直接取得する場合
                      initialLikesCount={event.likes_count}
                      currentUserId={currentUser?.id}  // currentUser の ID を渡す
                      disabled={!currentUser}          // 未ログインの場合は無効
                    />
                  </div>
                </div>
                <div className="absolute top-1 left-1 flex flex-col items-center bg-orange-400 text-white p-2 rounded-full">
                  <p className="text-s font-bold">{mmdd}</p>
                  <p className="text-xs">({weekday})</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default EventSearch;