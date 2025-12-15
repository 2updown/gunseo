import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // <--- Add this line
  basePath: "/gunseo",
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
