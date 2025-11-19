# DevPulse - Developer Insights & Ideas

A modern blogging platform for developers to share insights, ideas, and innovations. Built with React, Vite, Express, and Neon PostgreSQL.

## Features

- 📝 Create and publish blog posts with rich content
- 🔍 Search posts by title, content, or excerpt
- 👍 Like/dislike system for posts
- 💬 Comment on posts
- 🔐 Google authentication via Firebase
- 🎨 Modern, responsive UI with smooth animations
- ⚡ Fast performance with Vite

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Firebase** - Authentication

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Neon** - Serverless PostgreSQL database
- **Drizzle ORM** - Database toolkit

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon database account
- Firebase project configured

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd vibe-coding
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase and Neon credentials.

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. (Optional) Add welcome post:
   - Connect to your Neon database
   - Run the SQL from `welcome-post.sql`

### Development

Run both frontend and backend:
```bash
npm run dev:all
```

Or run separately:
```bash
# Frontend only (port 5173)
npm run dev

# Backend only (port 3001)
npm run dev:server
```

Visit `http://localhost:5173` to see the app.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vibe-coding)

After deployment, configure environment variables in Vercel dashboard.

## Database Management

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Project Structure

```
vibe-coding/
├── api/                  # Vercel serverless functions
├── server/               # Express backend
│   ├── db/              # Database schema and connection
│   └── index.ts         # API routes
├── src/                 # React frontend
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── context/         # React contexts
│   ├── firebase/        # Firebase config
│   └── hooks/           # Custom hooks
├── public/              # Static assets
└── dist/                # Production build (generated)
```

## Environment Variables

### Frontend (VITE_*)
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID
- `VITE_API_URL` - API URL (http://localhost:3001/api for dev, /api for production)

### Backend
- `DATABASE_URL` - Neon PostgreSQL connection string
- `PORT` - Server port (default: 3001)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
