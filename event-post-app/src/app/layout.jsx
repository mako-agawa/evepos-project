// app/layout.js
import SpeedInsightsProvider from "@/components/general/SpeedInsightsProvider"; // ✅ 追加
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from '../components/layout/Header';
import Navbar from "@/components/layout/Navbar";
import { Suspense } from "react";
import { getURL } from "@/lib/utils";

export const metadata = {
  metadataBase: new URL(getURL()),
  title: "いべぽす",
  description: "伝えたいをポストしよう",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

};
const notoSansJP = Noto_Sans_JP({
  subsets: [],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} antialiased bg-gray-100 text-gray-600  mb-36`}>
        <Header />
        <SpeedInsightsProvider />
        <Suspense fallback={<div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>}>

          {children}
          
        </Suspense>
        <Navbar />
      </body>
    </html>
  );
}