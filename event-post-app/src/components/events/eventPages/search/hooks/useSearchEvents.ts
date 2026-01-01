import { useState, useEffect } from 'react';
import type { Event } from '@/types/event.type';
import { fetchAPI } from '@/utils/fetchAPI'; // 🔹 utilsからインポート

export const useSearchEvents = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [triggerSearch, setTriggerSearch] = useState(false);

  useEffect(() => {
    if (!triggerSearch) return;

    const fetchData = async () => {
      try {
        // 🔹 修正1: fetch ではなく fetchAPI を使用してベースURL等の問題を解決
        // 🔹 修正2: 戻り値を Event[] 型としてキャスト
        const data = (await fetchAPI(
          `/events/search?query=${searchKeyword}`
        )) as Event[];

        setSearchResults(data);
        
        // 🔹 修正3: 未使用だった locations 変数の行を削除（ビルドエラー回避）

      } catch (error) {
        console.error('Fetch error:', error);
        setSearchResults([]); // エラー時は空にするなどの処理
      } finally {
        setTriggerSearch(false);
      }
    };

    fetchData();
  }, [triggerSearch, searchKeyword]);

  return {
    searchKeyword,
    setSearchKeyword,
    searchResults,
    setSearchResults,
    triggerSearch,
    setTriggerSearch,
  };
};