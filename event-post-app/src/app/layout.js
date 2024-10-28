import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: [],
  weight: ["400", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata = {
  title: "いべぽす",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}