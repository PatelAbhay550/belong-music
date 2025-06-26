/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA Configuration
  experimental: {
    swcPlugins: []
  },
  
  // Headers for PWA support
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },

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
