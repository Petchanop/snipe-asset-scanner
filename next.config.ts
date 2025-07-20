import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: ["@mui/material-nextjs"],
};

export default nextConfig;
