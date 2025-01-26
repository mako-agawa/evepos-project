import { useAtom } from "jotai";
import { pageModeAtom } from "@/atoms/authAtom";
import { useCallback } from "react";

const usePageNavigation = () => {
  const [pageMode, setPageMode] = useAtom(pageModeAtom);

  // ナビゲーション処理をカスタムフックにカプセル化
  const handleNavigation = useCallback((mode) => {
    setPageMode(mode);
  }, [setPageMode]);

  // 現在のページに応じたクラスを適用する
  const getActiveClass = useCallback(
    (mode) => (pageMode === mode ? "text-orange-500" : "text-gray-600"),
    [pageMode]
  );

  return {
    handleNavigation,
    getActiveClass,
  };
};

export default usePageNavigation;