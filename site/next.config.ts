import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ai-edu',
  assetPrefix: '/ai-edu/',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
