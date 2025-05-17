const nextConfig = {
  reactStrictMode: true, // 厳格モードの有効化
  images: {
    domains: ['localhost', 'api.evepos.net'], // 開発と本番の両方のドメインを許可
  },
  experimental: {}, // 'appDir' を削除 (非推奨のため)
};

export default nextConfig;
