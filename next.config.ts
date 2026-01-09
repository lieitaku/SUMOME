import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 其他配置... */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "restless-frost-36397932.stg-s.snapup.jp",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.transparenttextures.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
