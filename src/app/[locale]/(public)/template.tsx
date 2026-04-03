"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            // 1. 初始状态：稍微透明，位置偏下 15px
            initial={{ opacity: 0, y: 15 }}

            // 2. 进场状态：完全不透明，位置归位
            animate={{ opacity: 1, y: 0 }}

            // 3. 动画参数：
            // easeOut: 减速曲线，开始快结束慢，非常自然
            // duration: 0.5s 是黄金时间，既不拖沓又有质感
            transition={{ ease: "easeOut", duration: 0.5 }}

            className="w-full"
        >
            {children}
        </motion.div>
    );
}