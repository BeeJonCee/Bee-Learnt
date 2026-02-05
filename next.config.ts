import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "docs",
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
