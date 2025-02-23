/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // 厳格モードの有効化
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // 開発環境
      },
      {
        protocol: "https",
        hostname: "api.evepos.net", // 本番環境
      },
    ],
  },
  experimental: {},  // 'appDir' は Next.js 13 以降デフォルトで有効なので不要
};

export default nextConfig;