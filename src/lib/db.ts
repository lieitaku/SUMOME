import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Vercel Serverless：DATABASE_URL 请使用 Supabase 连接池（Transaction 端口 6543 + ?pgbouncer=true），见 docs/vercel.md
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 仅开发环境打 query 日志，生产关闭以减少 I/O 与序列化开销
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;