import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 授权图片域名
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // 授权所有 Supabase 项目
      },
      {
        protocol: "https",
        hostname: "restless-frost-36397932.stg-s.snapup.jp",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  // 如果你需要忽略构建时的 Lint，建议在构建命令中使用: next build --no-lint
  typescript: {
    // 线上环境建议开启，但如果急着部署可以临时设为 true
    ignoreBuildErrors: true,
  },
  experimental: {
    // 可以在此放置 Server Actions 的优化配置
    serverActions: {
      bodySizeLimit: '2mb', // 这里的限制可以根据杂志上传的需求调整
    },
  },
};

export default nextConfig;