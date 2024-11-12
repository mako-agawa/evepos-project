
"use client"; // クライアントコンポーネントとして宣言

import { RecoilRoot } from 'recoil';

export default function RecoilProvider({ children }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}