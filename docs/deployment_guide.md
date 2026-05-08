# Multi-Platform Deployment Guide

This guide explains how to "dial in" and deploy the Restaurant Loyalty Ecosystem to various hosting platforms using the included configuration files.

## 🚀 Quick Reference

| Platform | Difficulty | Best For | Included Config |
| :--- | :--- | :--- | :--- |
| **Vercel** | ⭐ (Easy) | Next.js Native | `vercel.json` |
| **Netlify** | ⭐ (Easy) | High Performance | `netlify.toml` |
| **Cloudflare** | ⭐⭐ (Med) | Scale / Edge | `wrangler.toml` |
| **Firebase** | ⭐⭐ (Med) | Static Hosting | `firebase.json` |
| **Railway** | ⭐ (Easy) | Containers/Docker | `Dockerfile` |
| **Render** | ⭐⭐ (Med) | Blueprints | `render.yaml` |

---

## 🌩️ 1. Vercel (Recommended)
1. Import repository to Vercel.
2. Vercel will automatically detect Next.js.
3. The `vercel.json` file will optimize headers and caching.
4. Click **Deploy**.

## 💠 2. Netlify
1. Connect repository to Netlify.
2. The `netlify.toml` file handles the build command (`npm run build`) and detects the Next.js plugin.
3. Use **Next.js Runtime** (automatic).

## ☁️ 3. Cloudflare Pages
1. In Cloudflare Dashboard: **Workers & Pages > Create > Pages > Connect to Git**.
2. Select repository.
3. Build Settings:
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`
4. The `wrangler.toml` provides additional environment context.

## 📦 4. Docker-based (Railway, Fly.io, Heroku)
The included `Dockerfile` uses **Next.js Standalone Mode**, which significantly reduces image size.
- **Railway**: Simply connect your repo; it will find the `Dockerfile` and deploy automatically.
- **Fly.io**: Run `fly launch`. It will detect the `Dockerfile`.
- **Heroku**: Use the Heroku Docker container registry.

## 📂 5. Static Hosting (GitHub Pages / Firebase)
If you want to deploy as a pure static site:
1. Update `next.config.ts`: change `output: 'standalone'` to `output: 'export'`.
2. Run `npm run build`. This generates an `out/` folder.
3. **Firebase**: Run `firebase deploy`. It uses the `firebase.json` pointing to `out/`.
4. **GitHub Pages**: Set the build folder to `out` in your GitHub Actions workflow.

---

## 🛠️ Environment Variables
Ensure you add any variables from `.env.example` to your platform's **Environment Variables** or **Secrets** dashboard settings.
