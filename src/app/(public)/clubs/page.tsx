import React from "react";
import { prisma } from "@/lib/db";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClubSearchClient from "@/components/clubs/ClubSearchClient";

// 服务端组件，支持 async/await 直接读库
export default async function ClubsPage() {
  // 1. 获取所有数据（顺序由前端按「地区顺序」或「新着順」控制）
  const clubs = await prisma.club.findMany({
    where: {
      id: { not: 'official-hq' }
    },
  });

  return (
    <>
      {/* 2. 把真实数据传给客户端组件 */}
      <ClubSearchClient initialClubs={clubs} />
    </>
  );
}