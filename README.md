# 🎵 Belong Music

A modern, Notion-style music streaming application built with Next.js and JioSaavn API integration. Experience your favorite music with a clean, intuitive interface inspired by Notion's design principles.

## ✨ Features

### 🎵 Core Music Features
- **High-Quality Streaming**: Stream music in 320kbps quality
- **Search Functionality**: Search for songs, albums, artists, and playlists
- **Personal Library**: Like songs and create your personal collection
- **Recently Played**: Track and continue listening to recent songs
- **Download Support**: Download your favorite tracks
- **Audio Player**: Full-featured player with play, pause, and controls

### 🎨 User Interface
- **Notion-Style Design**: Clean, minimal interface inspired by Notion
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Themes**: Consistent theming throughout the app
- **Smooth Animations**: Powered by Framer Motion
- **Custom Components**: Reusable UI components for consistent design

### 📱 Quick Access Features
- ❤️ **Liked Songs**: Your favorite tracks collection
- 🕐 **Recently Played**: Continue listening where you left off
- 🔍 **Discover Weekly**: New music recommendations
- 📡 **Release Radar**: Latest releases from your favorite artists
- 🎧 **Daily Mix**: Personalized daily playlists
- 🌙 **Chill Vibes**: Relaxing music for any mood

### 🔧 Technical Features
- **Persistent Storage**: LocalStorage-based data persistence
- **SEO Optimized**: Meta tags and structured data for better discoverability
- **API Integration**: JioSaavn API for music data and streaming
- **Toast Notifications**: User feedback for all actions
- **Error Handling**: Robust error handling and fallbacks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd examgain
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
# or
yarn install
```

3. **Start the development server**
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── NotionHeader.js     # Application header with search
│   ├── NotionSidebar.js    # Navigation sidebar
│   ├── NotionMusicCard.js  # Music item cards
│   ├── NotionPlayerBar.js  # Audio player component
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useLikedSongs.js    # Liked songs management
│   ├── useRecentlyPlayed.js # Recently played tracking
│   └── ...
├── [songid]/           # Song details pages
├── search/             # Search functionality
├── liked/              # Liked songs page
├── recently-played/    # Recently played page
├── discover/           # Discover weekly page
├── chill/              # Chill vibes page
└── ...
public/                 # Static assets
├── LOGO.svg           # Application logo
└── ...
```

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications
- **[Axios](https://axios-http.com/)** - HTTP client for API calls
- **[JioSaavn API](https://github.com/sumitkolhe/jiosaavn-api)** - Music data and streaming

## 🎯 Usage

### Navigation
- Use the sidebar to navigate between different sections
- Mobile users can access the sidebar via the hamburger menu
- Search for music using the search bar in the header

### Music Playback
- Click the play button on any song card to start playback
- Use the player bar at the bottom for playback controls
- Like songs by clicking the heart icon

### Personal Library
- Liked songs are automatically saved to localStorage
- Access your liked songs from the sidebar or Quick Access
- Recently played songs are tracked automatically

### Search
- Use the search bar to find songs, albums, and artists
- Filter results by type using the tabs
- All search results support play and like functionality

## 🔧 Configuration

### Environment Variables
Currently, the app uses public APIs and doesn't require environment variables. If you need to configure API endpoints:

```env
# .env.local (if needed)
NEXT_PUBLIC_API_BASE_URL=your_api_url
```

### Customization
- Modify `app/globals.css` for global styles
- Update components in `app/components/` for UI changes
- Adjust API endpoints in page components as needed

## 📱 Mobile Support

The application is fully responsive and includes:
- Mobile-optimized sidebar with hamburger menu
- Touch-friendly interface elements
- Responsive grid layouts
- Mobile-specific search interface
- Optimized button sizes and spacing

## 🐛 Known Issues

- API rate limiting may occur with heavy usage
- Some songs may not have download URLs available
- Lyrics display is dependent on API availability

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes only. All music content belongs to respective owners.

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy is using [Vercel](https://vercel.com/):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/examgain/issues) page
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🙏 Acknowledgments

- [JioSaavn](https://www.jiosaavn.com/) for the music API
- [Notion](https://notion.so/) for design inspiration
- [Next.js team](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility classes

---

Made with ❤️ using Next.js and modern web technologies.
