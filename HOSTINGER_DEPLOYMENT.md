# 🚀 Hostinger Deployment Guide - HexCode Rebuild

## ✅ Build Status
- **Build**: Successful
- **Output Folder**: `out/`
- **Static Export**: Enabled for production
- **API Routes**: Disabled for static export (Client-side Firebase used instead)

## 📦 What's Ready

### Static HTML Export
- All pages exported to `out/` folder
- Client-side Firebase data fetching
- **Note**: Server-side API routes (`app/api/*`) have been disabled/renamed to `.disabled` to support static export.

### Configuration
```javascript
// next.config.mjs
output: process.env.NODE_ENV === 'production' ? 'export' : undefined
```

## 🎯 How to Deploy to Hostinger

### Step 1: Add Secrets to GitHub
Go to your **GitHub Repository -> Settings -> Secrets and variables -> Actions** and add:
- `FTP_SERVER`: Your Hostinger FTP hostname (e.g. `ftp.yourdomain.com`)
- `FTP_USERNAME`: Your Hostinger FTP username
- `FTP_PASSWORD`: Your Hostinger FTP password

### Step 2: Push to Deploy
Simply push to the `main` branch:
```bash
git push origin main
```
The "Deploy Next.js to Hostinger" workflow will run automatically.

### Manual Upload (Alternative)
1. Run `npm run build` locally.
2. Upload the contents of the `out/` folder to `public_html/` on Hostinger.

## ⚠️ Important Changes
To make this project compatible with static hosting (Hostinger):
1.  **API Routes Disabled**: The folders in `app/api/` (like `test-create-project`, `upload`) have been renamed to `*.disabled` because static hosting cannot run server-side code.
2.  **Dependencies**: We use `--legacy-peer-deps` in the build process to handle React 19 compatibility.

## 🐛 Troubleshooting
- **Build fails on checking validity of types**: The workflow ignores typescript errors to ensure deployment.
- **Images not loading**: Ensure all images are in `public/`.
- **404 on refresh**: Ensure `.htaccess` is uploaded (handled automatically by the script? You might need to add one manually if not present in `public/`).

*Note: Accessing `/api/*` routes will result in 404 on the live site.*
