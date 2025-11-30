# Deployment Guide - Reminder Platform

## Prerequisites
- GitHub repository: https://github.com/tpajith-byte/Reminder-platform
- Supabase project configured
- Netlify account (free tier works)

## Step-by-Step Deployment to Netlify

### 1. Sign Up for Netlify
1. Go to https://netlify.com
2. Click "Sign up" and choose "Sign up with GitHub"
3. Authorize Netlify to access your GitHub account

### 2. Create New Site from Git
1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub" as your Git provider
3. Find and select your repository: **Reminder-platform**

### 3. Configure Build Settings
Netlify should auto-detect Next.js, but verify these settings:
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 4. Add Environment Variables
Before deploying, add your Supabase credentials:
1. Click "Add environment variables"
2. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xihnbfktplfxlupscpwr.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaG5iZmt0cGxmeGx1cHNjcHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MjcyMDcsImV4cCI6MjA4MDAwMzIwN30.jFhIZZMPnZW-gEMY2fiCYsOIK1DnCyFP8R0aTa7ubSI`

### 5. Deploy
1. Click "Deploy site"
2. Wait for the build to complete (2-5 minutes)
3. Once done, you'll get a URL like: `https://your-site-name.netlify.app`

### 6. Update Supabase Auth Settings (Important!)
To allow authentication from your Netlify domain:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Netlify URL to **Site URL**: `https://your-site-name.netlify.app`
3. Add to **Redirect URLs**: `https://your-site-name.netlify.app/**`

### 7. Test Your Deployed App
1. Visit your Netlify URL
2. Sign up with a new account
3. Create a test reminder
4. Verify it saves correctly

## Updating the App
Every time you push to GitHub's `master` branch, Netlify will automatically rebuild and redeploy your app!

## Custom Domain (Optional)
To use your own domain:
1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

## Troubleshooting
- **Build fails**: Check the build logs in Netlify
- **Can't sign up**: Verify environment variables are set and Supabase auth URLs are configured
- **Database errors**: Ensure you ran the `supabase-schema.sql` in your Supabase project
