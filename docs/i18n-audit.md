# 全站 i18n 审计清单

本文档与「全站双语」实施同步更新：已接 `next-intl` 的组件可勾掉；硬编码待迁移动 `messages/*.json`。

## 质量门结论

见 [`docs/i18n-quality-gate.md`](i18n-quality-gate.md)（P0/P1 抽检结论与必改项跟踪）。

## 已部分/完全使用 messages

- `src/components/layout/Header.tsx`、`Footer.tsx`
- `src/components/layout/LocaleSwitcher.tsx`
- `src/components/home/Hero.tsx`（Hero 命名空间）
- `src/components/home/ActivityReport/index.tsx`（Home / ActivitiesPage；日期月份按 locale 格式化）
- `src/components/clubs/ClubCard.tsx`（ClubDetail：`introFallback`、链接 title、`cardDetails`）
- `src/components/activities/StandardTemplate.tsx`（ActivitiesPage：活动模板场地/费用标签）
- `src/components/activities/ActivitiesListClient.tsx`（列表卡片日期月份）
- `src/components/magazine/MagazineClientComponents.tsx`（MagazineReader）
- `src/app/[locale]/(public)/about/page.tsx`（metadata）；`AboutClient.tsx` 正文
- `src/app/[locale]/(public)/company/page.tsx`、`CompanyClient.tsx`（CompanyPage）
- `src/app/[locale]/(public)/magazines/page.tsx`、`MagazinesClient.tsx`、`magazines/[slug]/page.tsx`（MagazinesPage、MagazineDetail、地区英文映射 `prefecture-en`）
- `src/app/[locale]/layout.tsx`、`not-found.tsx`
- Admin：`AdminSidebar`、`AdminPageTitle`、`dashboard/page`、`admin/layout`（部分英混）

## 待迁移（公共前台，硬编码日文为主）

| 区域 | 路径 |
|------|------|
| 首页 | `(public)/page.tsx` 预览条、`CTA.tsx`、`AboutService.tsx`、`PickupClubs.tsx`、`ManagerInfo.tsx` |
| 俱乐部列表 | `(public)/clubs/page.tsx`、`clubs/map/page.tsx`（`ClubSearchClient` 已部分 messages + 日文県名用于 DB 匹配） |
| 俱乐部详情 | `(public)/clubs/[slug]/page.tsx`、`recruit/page.tsx` |
| 活动 | `(public)/activities/page.tsx`、`activities/[id]/page.tsx`（列表/详情客户端已大量 messages） |
| 静态页 | `contact`、`characters`、`partners`、`terms`、`privacy`、`prefectures/[pref]` |
| 账号 | `account-deleted`、`manager/login`、`manager/entry` |
| 其他 | `RabbitBanner` 配置与部分 `Hero`/`HakuhoLightbox` 无障碍文案 |

## 管理后台

- 各 `admin/**/page.tsx`、`*Client.tsx`、`guideContent.ts` 等大量日文/混排，建议后续单开批次迁移到 `Admin.*` 命名空间。
- 杂志表单已增加可选 `titleEn` / `descriptionEn`（英文明细仍可为空，前台回退日文）。

## 数据库

- `Club`：`nameEn` / `descriptionEn`（空则回退）。
- `Activity`：`titleEn` / `contentEn`（空则回退）。
- `Magazine`：`titleEn` / `descriptionEn`（空则回退）；`region` 仍为日文/DB 原值，英文站展示经 `regionDisplayForLocale` 映射。
- `PrefectureBanner` 等：按需增英文字段或维持日文-only 策略。

## 组件日文盘点（计划项）

- **已处理**：活动列表/首页活动卡片日期、`StandardTemplate` 事件字段、`ClubCard`  footer 与摘要、`MagazineReader` / 分享按钮。
- **仍为日文且合理**：`ClubSearchClient` / `MagazinesClient` 内県名数组（与 `club.area` / `mag.region` 匹配）；管理员表单校验与标签大量日文。
- **注释与开发者文案**：`Header.tsx` 等文件内中文/日文注释不计入用户可见审计。
