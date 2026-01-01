'use client';

import { useAtom } from 'jotai';
import { pageModeAtom } from '@/atoms/authAtom';
import EventIndex from '@/components/events/eventPages/EventIndex';
import EventSchedule from '@/components/events/eventPages/schedule/EventSchedule';
import EventArchive from '@/components/events/eventPages/schedule/EventArchive';
import EventSearch from '@/components/events/eventPages/search/EventSearch';
import type { PageMode } from '@/atoms/authAtom';
import { useEffect, useState } from 'react';

export default function Events() {
  const [pageMode] = useAtom<PageMode>(pageModeAtom);
  const [isMounted, setIsMounted] = useState(false);

  // コンポーネントがブラウザにマウントされたらフラグを立てる
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // マウント前（サーバー側含む）は何も表示しないことで不整合を防ぐ
  // ※ 必要であればここに <LoadingSpinner /> などを入れてもOKです
  if (!isMounted) {
    return null; 
  }

  return (
    <div className="flex flex-col items-center px-4 pt-16 mb-16 h-full mx-auto">
      {pageMode === 'index' && <EventIndex />}
      {pageMode === 'schedule' && (
        <>
          <EventSchedule />
          <EventArchive />
        </>
      )}
      {pageMode === 'search' && <EventSearch />}
    </div>
  );
}