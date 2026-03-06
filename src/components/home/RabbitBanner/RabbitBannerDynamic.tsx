"use client";

import dynamic from "next/dynamic";

// Next.js 16: ssr: false 只能在 Client Component 中使用，故在此包装
const RabbitWalkingBanner = dynamic(() => import("./index"), { ssr: false });

export default RabbitWalkingBanner;
