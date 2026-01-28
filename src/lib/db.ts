import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // 开发时显示 SQL 查询日志，方便调试
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;