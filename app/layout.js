import "./globals.css";



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
  openGraph: {
    title: "Belong Music - Your Ultimate Music Streaming Experience",
    description: "Discover, stream, and enjoy millions of songs from your favorite artists.",
    url: 'https://belong-music.vercel.app',
    siteName: 'Belong Music',
    images: [
      {
        url: '/LOGO.svg',
        width: 800,
        height: 600,
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
    images: ['/LOGO.svg'],
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
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
