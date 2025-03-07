'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
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
        <button
          onClick={handleLogout}
          className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg text-lg"
        >
          ログアウト
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-3  bg-gray-300 hover:bg-gray-400 rounded-lg text-lg"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default LogoutPage;