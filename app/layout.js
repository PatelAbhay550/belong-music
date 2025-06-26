import "./globals.css";
import { AudioProvider } from "./contexts/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";
import PWAInstaller from "./components/PWAInstaller";
import PWAStatus from "./components/PWAStatus";



export const metadata = {
  title: {
    default: "Belong Music - Your Ultimate Music Streaming Experience",
    template: "%s | Belong Music"
  },
  description: "Discover, stream, and enjoy millions of songs from your favorite artists. Create playlists, explore trending music, and experience high-quality audio streaming.",
  keywords: ["music", "streaming", "songs", "playlists", "artists", "albums", "audio", "entertainment"],
  authors: [{ name: "Belong Music" }],
  creator: "Belong Music",
  publisher: "Belong Music",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://belong-music.vercel.app'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Belong Music',
  },
  openGraph: {
    title: "Belong Music - Your Ultimate Music Streaming Experience",
    description: "Discover, stream, and enjoy millions of songs from your favorite artists.",
    url: 'https://belong-music.vercel.app',
    siteName: 'Belong Music',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Belong Music Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Belong Music - Your Ultimate Music Streaming Experience',
    description: 'Discover, stream, and enjoy millions of songs from your favorite artists.',
    creator: '@belongmusic',
    images: ['/icons/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Belong Music" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`antialiased`}
      >
        <AudioProvider>
          {children}
          <GlobalPlayer />
          <PWAInstaller />
          <PWAStatus />
        </AudioProvider>
      </body>
    </html>
  );
}
