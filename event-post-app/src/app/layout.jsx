// app/layout.js

import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from '../components/layout/Header';
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";




export const metadata = {
  title: "いべぽす",
  description: "あなたの好きを教えてください",
};

const notoSansJP = Noto_Sans_JP({
  subsets: [],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

export default function RootLayout({ children }) {


  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} antialiased bg-gray-100 text-gray-700 mb-24`}>

          <Header />
          <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
            <Navbar />
      </body>
    </html>
  );
}