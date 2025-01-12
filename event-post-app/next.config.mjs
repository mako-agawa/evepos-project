// next.config.mjs
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ["localhost"], // 許可するドメインを設定
    },
    experimental: {
      appDir: true,
    },
  };
  
  export default nextConfig; // ← 修正