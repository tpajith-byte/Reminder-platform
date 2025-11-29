# Implementation Plan - Reminder Platform (Next.js + Supabase)

## Goal Description
Build a modern "Reminder Platform" using **Next.js 14+ (App Router)**, **Tailwind CSS**, and **Supabase**. The platform will support user authentication, reminder management, and geolocation features using PostGIS.

## User Review Required
> [!IMPORTANT]
> **Existing Backend**: The current `backend/` folder contains a FastAPI app. With the move to Supabase, this might be redundant. **Should we keep it for specific background tasks (e.g., email sending scripts) or aim to replace it entirely with Supabase Edge Functions / Next.js API routes?**

> [!NOTE]
> **Supabase Setup**: I will need your Supabase project credentials (URL and Anon Key) to configure the environment variables.

## Proposed Changes

### Frontend (New)
#### [NEW] `frontend/` (Next.js Application)
- Initialize using `create-next-app` with TypeScript, Tailwind CSS, and ESLint.
- **Stack**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS.
- **Dependencies**: `@supabase/supabase-js`, `lucide-react` (icons), `zod` (validation).

### Backend & Database (Supabase)
- **Auth**: Use Supabase Auth for user management.
- **Database**: PostgreSQL.
    - Enable **PostGIS** extension.
    - Tables: `profiles`, `reminders` (with location data).
- **API**: Use Supabase Client in the frontend for direct DB interaction (with RLS policies).

### Deployment
- **Netlify**: Configure `netlify.toml` for deployment.

## Verification Plan

### Automated Tests
- `npm run dev` to verify Next.js app starts.
- Verify Supabase connection by fetching a test row.

### Manual Verification
- Sign up/Login flow using Supabase Auth.
- Create a reminder and verify it appears in the dashboard.
