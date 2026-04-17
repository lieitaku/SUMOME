/**
 * 都道府県の地理順（北海道→沖縄）— 前端・后台排序共用
 */

import { Prisma } from "@prisma/client";

export const PREFECTURE_ORDER: string[] = [
    "北海道",
    "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
    "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
    "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県",
    "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

/** 根据都道府県名得到地理顺序索引，用于排序；未匹配时返回 999 */
export function getPrefectureIndex(area: string): number {
    const idx = PREFECTURE_ORDER.indexOf(area);
    return idx === -1 ? 999 : idx;
}

/**
 * PostgreSQL ORDER BY 用：与 getPrefectureIndex 一致（未列出的 region → 999）。
 * Admin 杂志列表「地域」排序在 DB 端分页时使用（表别名固定为 "Magazine"）。
 */
export function sqlPrefectureOrderCase(): Prisma.Sql {
    const whens = PREFECTURE_ORDER.map(
        (name, i) => Prisma.sql`WHEN "Magazine"."region" = ${name} THEN ${i}`,
    );
    return Prisma.sql`CASE ${Prisma.join(whens, " ")} ELSE 999 END`;
}
