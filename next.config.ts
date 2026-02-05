import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  distDir: "docs",
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
