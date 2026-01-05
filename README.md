# Matt & Ashley — Wedding Splash

Elegant single-page splash built with Next.js + Tailwind. Guests can drop an email to receive wedding weekend updates that are stored in MongoDB Atlas.

## Setup

1) Copy `env.example` to `.env.local` and fill in your Mongo details:
```
MONGODB_URI=your-atlas-connection-string
MONGODB_DB=wedding
MONGODB_COLLECTION=updates
```

2) Install dependencies (already installed if you ran `create-next-app`):
```
npm install
```

3) Run locally:
```
npm run dev
```

## Deploying to Vercel
- Add the same env vars (`MONGODB_URI`, `MONGODB_DB`, `MONGODB_COLLECTION`) in the Vercel project settings.
- Push to GitHub (or import the repo) and deploy. The API route at `/api/subscribe` will write emails to the configured collection.
