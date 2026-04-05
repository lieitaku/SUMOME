# SUMOME 术语表与英文审校流程

本文档服务于**全站双语与译文质量**：统一品牌与相扑相关用语，并约定英文上线前的审校责任。

## 品牌与产品名（固定译法）

| 源文 | 英文 | 备注 |
|------|------|------|
| SUMOME | SUMOME | 品牌名保持全大写，不写作 “Sumome” 除非设计规范另有要求 |
| すもめ／スモメ | （正文可标注）SUMOME (nickname: Sumome) | 对外一句带过即可，避免冗长注音 |
| フォトブック | photobook | 与站内 Nav / Footer 已用词一致 |
| 横綱 | yokozuna | 不加引号；必要时首段可 Brief 解释 rank |
| 力士 | rikishi | 可保留日文罗马字；首次出现可考虑 “rikishi (professional sumo wrestler)” 视版面而定 |
| 道場 | dojo | 小写；专名如 “〇〇 Dojo” 首字母大写 |
| アマチュア相撲 | amateur sumo | |

## 语气与风格

- **日文为源文**；英文站为推广与信息并重，避免直译腔。
- **敬语**：英文不逐字译敬语，转为礼貌、清晰的现代商务/机构网站语气。
- **美式 / 英式**：全站择一（当前文案偏美式简短句）；勿混用拼写（color/colour）。

## 高风险页面（须人工或法务定稿）

以下路径的 `messages` 或法律文本**禁止**仅依赖机器翻译上线：

- 首页核心标语、关于我们（`AboutPage`）
- 联系页（`Contact`）
- 利用規約 / プライバシー（条款与隐私）
- 价格、赞助、合规相关说明

流程建议：**译员或 AI 初稿 → 对照本术语表 → 指定英文定稿人（或外包 LQA）→ PR 合并**。

## 技术侧约定

- 用户可见字符串**不得**长期留在 JSX 硬编码；须进 `messages/ja.json` / `messages/en.json`。
- **占位符**：翻译时保持 `{name}`、`{count}` 等 ICU/next-intl 变量及 HTML 标签不变。
- **联系表单 `inquiryStorage_*`**：写入数据库的种别文案在 `en.json` 中仍保留日文，与后台及历史数据一致；界面展示用 `inquiryType_*` 英文。
- **数据库英文字段**：`Club.nameEn` / `descriptionEn`、`Activity.titleEn` / `contentEn`、`Magazine.titleEn` / `descriptionEn` 为空时，英文站回退到日文内容。

## CI

运行 `npm run messages:check` 确保 `ja` / `en` 的 key 集合一致，避免漏翻或拼错 key。

## 批量翻译辅助

将嵌套 JSON 压平为 TSV 供外部翻译或 API 批量处理：

```bash
node scripts/messages-flatten.mjs ja > messages/ja.flat.tsv
```

译后需人工或脚本合并回嵌套 JSON，并再次执行 `messages:check`。

杂志数据库字段批量初稿：可用 `npm run magazines:export-for-translation` 导出 `id/slug/title/description` 及现有英文字段，译后通过管理后台或 SQL 写回 `titleEn` / `descriptionEn`。
