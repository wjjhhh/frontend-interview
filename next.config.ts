import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/frontend-interview",
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
};

export default nextConfig;
