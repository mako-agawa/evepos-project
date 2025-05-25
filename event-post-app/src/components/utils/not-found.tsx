'use client';
import { Button } from '@/components/commons/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-gray-600 text-lg mb-8">
        404 - ページが見つかりません
      </h1>
      <Button
        onClick={() => router.push('/')}
        className="text-white bg-orange-400 hover:bg-orange-500 rounded p-3 text-md"
      >
        新着インベントへ
      </Button>
    </div>
  );
}
