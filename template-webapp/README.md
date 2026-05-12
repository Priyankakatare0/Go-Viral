# Go Viral

An AI-powered virality analyzer web app for content creators, built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Supabase.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Docker](https://www.docker.com/) (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd 8x-hiring-template
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start local Supabase**
   ```bash
   # If you have another Supabase project running, stop it first:
   # supabase stop --project-id <other-project>

   supabase start
   ```

   This will output your local credentials (note: this project uses custom ports):
   ```
   API URL: http://127.0.0.1:54521
   Publishable key: sb_publishable_...
   Secret key: sb_secret_...
   ```

   Migrations are applied automatically during startup.

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with the keys from step 3:
   ```
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54521"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-publishable-key>"
   SUPABASE_SERVICE_ROLE_KEY="<your-secret-key>"
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password)

## Features

- User authentication (sign up, sign in, sign out)
- Protected routes
- Subscription tiers (Free / Pro)
- Profile management
- Account deletion
- Responsive design
- Dark mode support

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Auth pages (login, signup)
│   ├── profile/           # User profile
│   └── upgrade/           # Subscription upgrade flow
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── lib/                   # Utilities and Supabase clients
└── supabase/              # Database migrations
```

## Useful Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
supabase start    # Start local Supabase (applies migrations)
supabase stop     # Stop local Supabase
supabase studio   # Open Supabase Studio (local admin UI)
```

## Database Schema

The template uses a simple `subscriptions` table:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tier TEXT CHECK (tier IN ('free', 'pro')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Notes

- **No real payments**: The upgrade flow is simulated (writes directly to database)
- **Local auth**: Email verification is disabled in development mode
- **Test accounts**: Use any email/password to sign up locally

## Setup Issues I Ran Into

- Supabase startup can be slow on Windows Docker setups; restarting the local stack fixed the database bootstrap when it stalled.
- The app originally depended on a missing icon asset and a few unresolved imports; those were fixed during the build hardening pass.
- Analyzer writes could time out, so the app now falls back to localStorage for temporary analyses instead of showing an empty history.

## What I'd Improve With More Time

- Replace the mock virality analysis with a real AI inference pipeline.
- Persist temporary fallback analyses into Supabase once the database is reachable again.
- Expand the PDF export into a branded multi-page report with charts and visual score bars.
- Add more tool pages to better mirror the babiceva.ai-style reference app.

## Walkthrough

- Loom video: https://www.loom.com/share/20eef2016dd1466f9faf5e8b6ec30696
- Demo flow: signup, analyzer upload, dashboard history, and PDF report download.
- Mention the local Supabase fallback and the production-minded auth/error handling.

---

## QA Checklist

- Auth flow: signup, login, logout, protected-route redirect.
- Analyzer flow: file upload, caption validation, score generation, results rendering.
- Persistence flow: database write success path and localStorage fallback path.
- Subscription flow: pricing, checkout, success, dashboard/pro feature gating.
- Responsive flow: test mobile ($390px), tablet ($768px), desktop ($1280px+).
- Accessibility checks: keyboard tab order, visible focus ring, screen-reader error announcements.

See [CANDIDATE_ASSIGNMENT.md](./CANDIDATE_ASSIGNMENT.md) for assessment instructions.
