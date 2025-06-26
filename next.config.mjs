/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'c.saavncdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jiosaavan-harsh-patel.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jiosaavn-api.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'belong-music.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.jiosaavn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'belong-music.vercel.app',
        port: '',
        pathname: '/favicon.ico',
      }
    ],
  },
};

export default nextConfig;
