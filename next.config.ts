import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: ["@mui/material-nextjs"],
  experimental: {
    authInterrupts: true,
  }
};

export default nextConfig;
