import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  distDir: "docs",
  outputFileTracingRoot: process.cwd(),
  typescript: {
    // Temporary: some dependencies in this workspace have corrupted .d.ts files.
    // Reinstall node_modules to restore typechecking.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;



