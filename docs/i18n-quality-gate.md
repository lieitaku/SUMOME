# 英文质量门控结论（P0 / P1）

**日期**：2026-04-05  
**范围**：`messages/en.json` 相对 `ja.json` 同 key；抽样命名空间 Meta、Nav、Header、Footer、About、AboutPage、Contact、ActivitiesPage、ClubsPage、ClubDetail、Home。

## 结论：**PASS_WITH_EDITS**

可继续扩路由与组件迁移；合并前须完成下列必改项（已在同批次 PR 中处理或跟踪）。

## 必改项（术语 / 准确性）

| 项 | 位置 | 问题 | 处理 |
|----|------|------|------|
| 品牌名拼写 | `AboutPage.storyP1`（en） | 英文为 “UMOME”，与品牌 SUMOME 不一致 | 已改为 “SUMOME” |
| 存储类文案 | `Contact.inquiryStorage_*` | 日文保留 | 按 glossary 故意保留，无需改 |

## Rubric 快检摘要

- **术语**：除上述笔误外，Nav/Footer/Meta 与 `docs/glossary.md`（photobook、amateur sumo、yokozuna）基本一致。  
- **语气**：营销短句可读；AboutPage 英文为对外站语气，非敬语硬译。  
- **形式**：ICU 占位符与 `privacyConsent` 标签结构在 ja/en 对齐；`messages:check` 仅保证 key 一致。

## 建议（非门控阻塞）

- P2 命名空间可继续按比例抽检。  
- 新页面与 `src/components` 用户可见文案一律进 `messages`，避免英文站残留日文硬编码。
