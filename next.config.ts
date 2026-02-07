import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "docs",
  outputFileTracingRoot: process.cwd(),
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
};

export default nextConfig;
