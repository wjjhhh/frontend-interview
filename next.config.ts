import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Vercel edge network
  // output: 'export', // Uncomment for full static export
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Experimental features
  experimental: {
    // mdxRs: true, // Use Rust-based MDX compiler if needed
  },
};

export default nextConfig;
