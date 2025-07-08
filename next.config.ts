import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/atb",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
