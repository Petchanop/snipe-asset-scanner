import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  transpilePackages: ["@mui/material-nextjs"],
  // experimental: {
  //   authInterrupts: true,
  // },
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
