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
      // 如果你也用了 unsplash 或其他图床，记得也加在这里
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
    ],
  },
};

export default nextConfig;
