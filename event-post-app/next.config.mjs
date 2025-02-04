const nextConfig = {
  reactStrictMode: true,  // 厳格モードの有効化
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // 開発環境
        port: '3001',          // 必要ならポート番号を指定
      },
      {
        protocol: 'https',
        hostname: 'api.evepos.net', // 本番環境
      }
    ]
  },
  experimental: {},  // 'appDir' を削除 (非推奨のため)
};

export default nextConfig;