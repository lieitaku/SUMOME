/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许 Next.js 优化来自以下域名的图片
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co", // 授权给所有的 Supabase 存储桶
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
  // 如果 eslint 报错，我们可以直接在这里配置
  eslint: {
    // 允许在生产构建时忽略 lint 错误
    ignoreDuringBuilds: true,
  },
  // 开启实验性特性（如果需要）
  experimental: {
    // 这里可以放服务器组件相关的优化
  }
};

export default nextConfig;