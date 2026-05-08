import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Optimized for Docker/Railway/Fly.io
  images: {
    unoptimized: true, // Easier for static exports/GitHub Pages
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
