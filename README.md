# Reminder Platform

A modern reminder management platform built with Next.js 14, Supabase, and Tailwind CSS. Features location-based reminders with PostGIS integration.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Database**: PostgreSQL with PostGIS extension
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tpajith-byte/Reminder-platform.git
cd Reminder-platform
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local` (if not already created)
   - Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Set up the database schema:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase-schema.sql`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The `supabase-schema.sql` file contains:
- PostGIS extension for geolocation
- `reminders` table with spatial indexing
- Row Level Security (RLS) policies
- Automated triggers for `updated_at`

### Running the Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run**

## Features

- ✅ User authentication (sign up, login, logout)
- ✅ Create, read, update, delete reminders
- ✅ Location-based reminders
- ✅ Modern, responsive UI with glassmorphism design
- ✅ Row-level security for data protection
- 🚧 Geolocation features (coming soon)

## Deployment

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

## Project Structure

```
reminder-platform/
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   └── page.tsx
│   ├── utils/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   └── middleware.ts
├── backend/ (legacy - not in use)
└── supabase-schema.sql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
