/**
 * 批量创建俱乐部：仅创建数据库中尚不存在的名称；slug 自动生成。
 *
 * 运行（项目根目录）：
 *   npx tsx scripts/batch-create-clubs.ts
 *
 * 需已配置 .env 中的 DATABASE_URL（及 Prisma 所需的 DIRECT_URL）。
 * 新建俱乐部无真实照片时 mainImage 设为 /images/clubs/default-club.webp（对应 public/images/clubs/default-club.webp）。
 */

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

function loadEnvFromDotEnv() {
  const p = resolve(process.cwd(), ".env");
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFromDotEnv();

/** 文档中的地区（都道府県）与俱乐部名称 */
const CLUBS_TO_CREATE: { area: string; name: string }[] = [
  // 北海道・東北
  { area: "北海道", name: "札幌すもうスポーツ少年団" },
  { area: "北海道", name: "北斗市相撲協会" },
  { area: "北海道", name: "美幌相撲スポーツ少年団" },
  { area: "北海道", name: "津別町相撲少年団" },
  { area: "北海道", name: "大鵬道場" },
  { area: "青森県", name: "中泊道場" },
  { area: "青森県", name: "相撲道場天心館" },
  { area: "青森県", name: "田舎館相撲クラブ" },
  { area: "青森県", name: "追風海道場" },
  { area: "青森県", name: "木造中学校" },
  { area: "青森県", name: "五所川原相撲教室" },
  { area: "青森県", name: "田子道場" },
  { area: "岩手県", name: "津軽石相撲クラブ" },
  { area: "岩手県", name: "小原道場" },
  { area: "岩手県", name: "寺田道場" },
  { area: "宮城県", name: "仙台相撲クラブ" },
  { area: "宮城県", name: "加美農相撲クラブ" },
  { area: "宮城県", name: "丸山相撲クラブ" },
  { area: "宮城県", name: "気仙沼少年相撲教室" },
  { area: "宮城県", name: "栗駒相撲クラブ" },
  { area: "秋田県", name: "湯西相撲道場" },
  { area: "秋田県", name: "秋田北鷹相撲場" },
  { area: "山形県", name: "山形パーソナル相撲教室" },
  { area: "山形県", name: "三川チャレンジ相撲スポーツ少年団" },
  { area: "山形県", name: "鶴岡少年相撲教室" },
  { area: "福島県", name: "福島県県北相撲CLUB" },
  { area: "福島県", name: "北桜相撲クラブ" },
  { area: "福島県", name: "都山相撲愛好会" },
  { area: "福島県", name: "あかつ相撲道場" },
  { area: "福島県", name: "正心館　原ノ町相撲道場" },
  // 関東
  { area: "茨城県", name: "土浦相撲倶楽部" },
  { area: "茨城県", name: "牛久相撲クラブ" },
  { area: "茨城県", name: "古河市相撲スポーツ少年団" },
  { area: "茨城県", name: "友部相撲少年団" },
  { area: "茨城県", name: "雅山チーム" },
  { area: "栃木県", name: "おおたわら修志館" },
  { area: "栃木県", name: "おやま清勇館" },
  { area: "栃木県", name: "TSUとちぎエリア統括本部" },
  { area: "栃木県", name: "湧成たかはら相撲道場" },
  { area: "群馬県", name: "高崎相撲道場" },
  { area: "群馬県", name: "群馬大泉相撲クラブ" },
  { area: "群馬県", name: "桐生相撲道場" },
  { area: "埼玉県", name: "戸田市相撲連盟" },
  { area: "埼玉県", name: "草加相撲道場" },
  { area: "埼玉県", name: "入間少年相撲クラブ" },
  { area: "埼玉県", name: "坂戸市相撲連盟" },
  { area: "埼玉県", name: "朝霞市相撲連盟" },
  { area: "埼玉県", name: "さいたま相撲クラブ" },
  { area: "千葉県", name: "千葉市相撲教室" },
  { area: "千葉県", name: "市川行徳相撲クラブ" },
  { area: "千葉県", name: "松戸市相撲連盟" },
  { area: "千葉県", name: "船橋相撲クラブ" },
  { area: "千葉県", name: "柏相撲少年団" },
  { area: "千葉県", name: "成田相撲クラブ" },
  { area: "千葉県", name: "安房相撲クラブ" },
  { area: "千葉県", name: "鴨川市立鴨川小学校" },
  { area: "東京都", name: "小松竜道場" },
  { area: "東京都", name: "文京針ヶ谷相撲クラブ" },
  { area: "東京都", name: "葛飾白鳥相撲教室" },
  { area: "東京都", name: "千代田区相撲連盟" },
  { area: "東京都", name: "心拳道" },
  { area: "東京都", name: "江戸川少年相撲クラブ" },
  { area: "東京都", name: "清登白河" },
  { area: "東京都", name: "渋谷相撲クラブ" },
  { area: "東京都", name: "杉並桜" },
  { area: "東京都", name: "三鷹相撲クラブ" },
  { area: "東京都", name: "練馬石泉相撲クラブ" },
  { area: "東京都", name: "府中住吉相撲道場" },
  { area: "東京都", name: "立川練成館" },
  { area: "東京都", name: "多摩相撲クラブ" },
  { area: "東京都", name: "大田嵐相撲クラブ" },
  { area: "神奈川県", name: "川崎市相撲連盟" },
  { area: "神奈川県", name: "横浜市相撲連盟" },
  { area: "神奈川県", name: "葵相撲道場" },
  { area: "神奈川県", name: "五十嵐相撲クラブ" },
  { area: "神奈川県", name: "綱島少年相撲軍団" },
  { area: "神奈川県", name: "港南相撲クラブ" },
  { area: "神奈川県", name: "K.S.C" },
  { area: "神奈川県", name: "小田原相撲連盟" },
  // 中部
  { area: "新潟県", name: "小千谷相撲教室" },
  { area: "新潟県", name: "新潟総合相撲クラブ" },
  { area: "新潟県", name: "能生相撲教室" },
  { area: "新潟県", name: "黒崎相撲教室" },
  { area: "新潟県", name: "五泉相撲教室" },
  { area: "新潟県", name: "新津相撲教室" },
  { area: "富山県", name: "富山市相撲教室" },
  { area: "富山県", name: "滑川相撲クラブ" },
  { area: "富山県", name: "いわせの道場" },
  { area: "富山県", name: "黒だるま相撲クラブ" },
  { area: "石川県", name: "能登復興チーム" },
  { area: "石川県", name: "能登小木道場" },
  { area: "石川県", name: "鳴和志賀道場" },
  { area: "石川県", name: "穴水相撲教室" },
  { area: "石川県", name: "津幡町少年相撲教室" },
  { area: "福井県", name: "福井相撲クラブ" },
  { area: "山梨県", name: "笛吹相撲クラブ" },
  { area: "長野県", name: "長野市相撲クラブ" },
  { area: "長野県", name: "信州塩尻相撲クラブ" },
  { area: "長野県", name: "佐久相撲クラブ" },
  { area: "長野県", name: "松尾相撲クラブ" },
  { area: "長野県", name: "木曽相撲クラブ" },
  { area: "長野県", name: "駒ヶ根相撲クラブ" },
  { area: "岐阜県", name: "本巣相撲クラブ" },
  { area: "岐阜県", name: "都上市相撲クラブ" },
  { area: "岐阜県", name: "東海すもうクラブ" },
  { area: "岐阜県", name: "岐阜木曜クラブ" },
  { area: "岐阜県", name: "大垣市相撲少年団" },
  { area: "岐阜県", name: "高山相撲クラブ" },
  { area: "静岡県", name: "小山・御殿場相撲クラブ" },
  { area: "静岡県", name: "三島相撲クラブ" },
  { area: "静岡県", name: "富士わんぱく相撲クラブ" },
  { area: "静岡県", name: "富士宮市すもう倶楽部" },
  { area: "静岡県", name: "静岡市相撲教室" },
  { area: "静岡県", name: "山中道場" },
  { area: "静岡県", name: "やいず少年相撲クラブ" },
  { area: "静岡県", name: "浜松市相撲教室" },
  { area: "静岡県", name: "袋井相撲クラブ" },
  { area: "愛知県", name: "豊橋相撲道場" },
  { area: "愛知県", name: "岡崎市相撲教室" },
  { area: "愛知県", name: "中京クラブ" },
  { area: "愛知県", name: "トライル相撲クラブ" },
  { area: "愛知県", name: "トヨタジュニア相撲クラブ" },
  // 近畿（三重・奈良は文档无条目）
  { area: "滋賀県", name: "長浜相撲クラブ" },
  { area: "京都府", name: "京都相撲教室" },
  { area: "大阪府", name: "寝屋川相撲連盟" },
  { area: "大阪府", name: "守口市相撲連盟" },
  { area: "大阪府", name: "門真市相撲連盟" },
  { area: "大阪府", name: "牧方市相撲連盟" },
  { area: "大阪府", name: "大東市相撲連盟" },
  { area: "大阪府", name: "東大阪相撲道場" },
  { area: "大阪府", name: "堺少年相撲クラブ" },
  { area: "大阪府", name: "ポラリス相撲道場" },
  { area: "大阪府", name: "間口相撲道場" },
  { area: "大阪府", name: "大阪どりーむ相撲道場" },
  { area: "兵庫県", name: "西宮相撲教室" },
  { area: "兵庫県", name: "松陽相撲教室" },
  { area: "和歌山県", name: "和歌山市少年相撲教室" },
  // 中国
  { area: "鳥取県", name: "鳥取県立武道館" },
  { area: "鳥取県", name: "因幡相撲クラブ" },
  { area: "岡山県", name: "操南相撲クラブ" },
  { area: "広島県", name: "大川道場" },
  // 四国
  { area: "徳島県", name: "徳島すもうクラブ" },
  { area: "徳島県", name: "名西Jr.相撲俱楽部" },
  { area: "愛媛県", name: "勝山仁桜相撲クラブ" },
  { area: "愛媛県", name: "宇和島相撲愛好会" },
  { area: "高知県", name: "香南相撲クラブ" },
  // 九州・沖縄
  { area: "福岡県", name: "遠賀相撲教室" },
  { area: "福岡県", name: "猷相撲キッズ" },
  { area: "福岡県", name: "井上道場" },
  { area: "福岡県", name: "八女相撲クラブ" },
  { area: "佐賀県", name: "北方クラブ" },
  { area: "長崎県", name: "大村相撲クラブ" },
  { area: "長崎県", name: "中野相撲クラブ" },
  { area: "熊本県", name: "阿蘇相撲愛育会" },
  { area: "大分県", name: "別府実相寺相撲クラブ" },
  { area: "大分県", name: "USA双葉道場" },
  { area: "大分県", name: "大分　雷" },
  { area: "鹿児島県", name: "樟南Kids Bulls" },
  { area: "鹿児島県", name: "伊仙町相撲スポーツ少年団" },
  { area: "鹿児島県", name: "住用相撲クラブ" },
  { area: "鹿児島県", name: "朝日相撲スポーツ少年団" },
  { area: "鹿児島県", name: "笠利相撲クラブ" },
  { area: "鹿児島県", name: "瀬戸内少年相撲クラブ" },
  { area: "鹿児島県", name: "伊崎田相撲クラブ" },
  { area: "不明", name: "大喜鵬チーム" },
];

const DEFAULT_MAIN_IMAGE = "/images/clubs/default-club.webp";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.club.findMany({ select: { name: true } });
  const existingNames = new Set(existing.map((c) => c.name.trim()));

  const toCreate = CLUBS_TO_CREATE.filter(
    (c) => !existingNames.has(c.name.trim()),
  );

  const skipped = CLUBS_TO_CREATE.length - toCreate.length;
  let created = 0;
  const base = Date.now();

  for (let i = 0; i < toCreate.length; i++) {
    const row = toCreate[i];
    const slug = `club-${(base + i).toString(36)}`;
    await prisma.club.create({
      data: {
        name: row.name.trim(),
        slug,
        area: row.area,
        address: "未設定",
        subImages: [],
        mainImage: DEFAULT_MAIN_IMAGE,
        published: false,
        hidden: false,
      },
    });
    created += 1;
    console.log(`+ ${row.area} / ${row.name} → ${slug}`);
  }

  console.log("\n--- 完了 ---");
  console.log(`文档条数: ${CLUBS_TO_CREATE.length}`);
  console.log(`已跳过（同名已存在）: ${skipped}`);
  console.log(`新規作成: ${created}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
