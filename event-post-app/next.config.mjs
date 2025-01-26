const nextConfig = {
  reactStrictMode: true,  // 厳格モードの有効化
  images: {
    domains: ["localhost", "api.evepos.net"], // 開発と本番の両方のドメインを許可
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/rails/active_storage/**",
      },
      {
        protocol: "https",
        hostname: "api.evepos.net",
        pathname: "/rails/active_storage/**",
      },
    ],
  },
  experimental: {},  // 'appDir' を削除 (非推奨のため)
};

export default nextConfig;