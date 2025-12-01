# Deployment Guide - Cloudflare Pages

This guide explains how to deploy your NFL Journey project to Cloudflare Pages using GitHub.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Architecture](#deployment-architecture)
- [Step 1: Deploy Frontend to Cloudflare Pages](#step-1-deploy-frontend-to-cloudflare-pages)
- [Step 2: Deploy Backend](#step-2-deploy-backend)
- [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
- [Step 4: Update Frontend API URLs](#step-4-update-frontend-api-urls)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- GitHub account
- Cloudflare account (free)
- MongoDB Atlas account (for production database) OR keep MongoDB on your server
- Backend hosting service (Render, Railway, Fly.io, etc.)

## 🏗️ Deployment Architecture

```
┌─────────────────┐
│  GitHub Repo    │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│ Cloudflare   │  │ Backend Host │
│ Pages        │  │ (Render/etc) │
│ (Frontend)   │  │              │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
                ▼
         ┌──────────────┐
         │ MongoDB      │
         │ (Atlas/DB)   │
         └──────────────┘
```

## 🚀 Step 1: Deploy Frontend to Cloudflare Pages

### 1.1 Connect GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select **GitHub** and authorize Cloudflare
6. Select your repository: `data-str-project-two`
7. Click **Begin setup**

### 1.2 Configure Build Settings

**Project name:** `nfl-journey-frontend` (or your choice)

**Build settings:**
- **Framework preset:** `Vite` (or None)
- **Build command:** `cd frontend && npm run build`
- **Build output directory:** `frontend/dist`
- **Root directory:** `/` (leave empty or set to `/`)
- **Node version:** `18` or `20`

**Environment variables (add these):**
```
NODE_VERSION=18
VITE_API_URL=https://your-backend-url.com
```

### 1.3 Deploy

1. Click **Save and Deploy**
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at: `https://nfl-journey-frontend.pages.dev`

### 1.4 Custom Domain (Optional)

1. Go to your project settings
2. Click **Custom domains**
3. Add your domain
4. Update DNS records as instructed

## 🔧 Step 2: Deploy Backend

### Option A: Render (Recommended - Free Tier)

1. Go to [Render](https://render.com)
2. Sign up/login with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `nfl-journey-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `/backend`
6. Add Environment Variables:
   ```
   PORT=10000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nfl-journey
   NODE_ENV=production
   ```
7. Click **Create Web Service**
8. Your backend will be at: `https://nfl-journey-backend.onrender.com`

### Option B: Railway

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Add environment variables (same as Render)
6. Railway auto-detects Node.js and deploys

### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Initialize: `fly launch` (in backend directory)
4. Deploy: `fly deploy`

## 🔐 Step 3: Configure Environment Variables

### Frontend (Cloudflare Pages)

In Cloudflare Pages → Your Project → Settings → Environment variables:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (Render/Railway/etc.)

```
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nfl-journey
NODE_ENV=production
JWT_SECRET=your-secret-key-here
```

## 🔄 Step 4: Update Frontend API URLs

Since your frontend uses relative URLs (`/api/...`), you have two options:

### Option A: Use Environment Variable (Recommended)

Update your API files to use environment variable:

**Create `frontend/src/config/api.ts`:**
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

Then update each API file to use this:
```typescript
baseQuery: fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/teams`, // Instead of '/api/teams'
}),
```

### Option B: Use Cloudflare Pages Rewrites

Create `frontend/public/_redirects`:
```
/api/*  https://your-backend-url.onrender.com/api/:splat  200
```

Or use `wrangler.toml` for more advanced routing.

## 📝 Quick Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] MongoDB connection string configured
- [ ] Frontend environment variables set
- [ ] API URLs updated in frontend
- [ ] CORS configured on backend for frontend domain
- [ ] Test deployment works end-to-end

## 🐛 Troubleshooting

### Frontend Build Fails

**Error:** `Cannot find module`
- **Fix:** Ensure `NODE_VERSION=18` is set in Cloudflare Pages

**Error:** Build timeout
- **Fix:** Increase build timeout in Cloudflare Pages settings

### Backend Connection Issues

**Error:** CORS errors
- **Fix:** Update backend CORS to allow your Cloudflare Pages domain:
```javascript
app.use(cors({
  origin: ['https://your-site.pages.dev', 'https://yourdomain.com']
}));
```

**Error:** API not found (404)
- **Fix:** Check that `VITE_API_URL` is set correctly
- **Fix:** Verify backend is running and accessible

### MongoDB Connection

**Error:** MongoDB connection failed
- **Fix:** Use MongoDB Atlas (cloud) instead of localhost
- **Fix:** Whitelist your backend server IP in MongoDB Atlas
- **Fix:** Update `MONGODB_URI` in backend environment variables

## 🔗 Useful Links

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📌 Notes

- Cloudflare Pages is **free** for unlimited sites
- Render free tier has **sleep after 15 min inactivity**
- Consider using MongoDB Atlas (free tier available)
- Always use environment variables for sensitive data
- Test locally with production URLs before deploying

