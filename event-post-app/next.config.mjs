/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    // domains は削除し、remotePatterns を使用します
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.evepos.net',
        port: '',
        pathname: '/rails/active_storage/**',
      },
    ],
  },
};

export default nextConfig;
