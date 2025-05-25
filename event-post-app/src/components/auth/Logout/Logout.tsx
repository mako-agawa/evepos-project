'use client';

import { useAuth } from '@/components/auth/hooks/useAuth';
import { Button } from '@/components/commons/button';
import { useRouter } from 'next/navigation';

export function Logout() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleCancel = () => {
    router.back(); // 前のページに戻る
  };

  return (
    <div className="flex flex-col items-center pt-36">
      <h1 className="text-2xl font-bold mb-8">ログアウトしますか？</h1>
      <div className="flex space-x-4">
        <Button
          onClick={handleLogout}
          className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg text-lg"
        >
          ログアウト
        </Button>
        <Button
          onClick={handleCancel}
          className="px-6 py-3  bg-gray-300 hover:bg-gray-400 rounded-lg text-lg"
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
}
