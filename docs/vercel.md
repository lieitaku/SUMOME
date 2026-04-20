# Vercel 部署说明

本文档说明在 Vercel 上部署本项目时的环境变量与数据库连接配置，用于避免后台管理页面加载慢、连接数耗尽等问题。

---

## 1. 数据库连接：必须使用连接池（Supabase Transaction Mode）

在 Vercel 上，每个 Serverless 函数可能单独建连，直接连 Postgres 会很快耗尽连接数并导致请求变慢或报错。**必须**使用 Supabase 的 **Transaction Mode 连接池**（端口 `6543`）。

### 1.1 在 Supabase 获取连接串

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 选择项目 → **Project Settings** → **Database**。
2. 在 **Connection string** 区域：
   - **Transaction**（或 “Connection pooling” / “Use connection pooling”）→ 复制 URI，端口应为 **6543**。
   - 若只有 “Direct” 和 “Session”，请选带 **Transaction** 或 **Pooler (port 6543)** 的选项。

Transaction 模式示例（仅格式，请用你项目里的实际值）：

```txt
postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

或旧格式：

```txt
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:6543/postgres
```

### 1.2 Prisma 与 Transaction 模式（关闭 Prepared Statements）

Supabase 的 Transaction 池不支持 prepared statements，Prisma 需在连接串中加上 `?pgbouncer=true`，否则可能报错。

在 **Vercel 环境变量** 中设置：

| 变量名 | 用途 | 取值 |
|--------|------|------|
| `DATABASE_URL` | 应用运行时（Vercel） | 上一步复制的 **Transaction 池** URI，末尾加上 `?pgbouncer=true`。例如：`postgresql://...:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | 仅迁移（`prisma migrate`） | **Direct** 连接串（端口 5432），不要加 `pgbouncer=true` |

- 本地开发：可以继续用 Direct，或同样用 Transaction + `?pgbouncer=true`。
- 迁移只会在本地或 CI 跑，用 `DIRECT_URL` 即可。

### 1.3 小结

- **Vercel 上**：`DATABASE_URL` = Transaction 池（6543）+ `?pgbouncer=true`。  
- **迁移**：使用 `DIRECT_URL`（直连 5432）。  
- 这样既避免连接数爆掉，又避免 Prisma 在池化模式下报错。

---

## 2. 其他环境变量（Vercel）

在 Vercel 项目 **Settings → Environment Variables** 中至少配置：

- `DATABASE_URL`：见上文（池化 + `?pgbouncer=true`）。
- `DIRECT_URL`：直连，仅迁移用。
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`：前端与 Middleware 认证用；构建期会打入客户端 bundle，**Production 与 Preview 部署若缺省会导致浏览器侧 Supabase 请求异常**。
- **`SUPABASE_SERVICE_ROLE_KEY`（仅服务端）**：在 [Supabase Dashboard](https://supabase.com/dashboard) → **Project Settings** → **API** → `service_role` **secret**。**必填**：俱乐部新規登録等 Server Action（`auth.admin.createUser`）依赖它。切勿写入 `NEXT_PUBLIC_*` 或提交到仓库。  
  - 变量名须 **完全一致**（`SUPABASE_SERVICE_ROLE_KEY`）。若漏配或拼错，服务端日志可能出现 `supabaseKey is required`。

生产环境不要提交 `.env`，只在 Vercel 里配置。

**注**：プレビュー機能は `PreviewDraft` テーブル（DB）を使用。Redis は不要。

### 2.1 reCAPTCHA（联系表单）与「网站密钥的网域无效」

联系页使用 **Google reCAPTCHA v3**（`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY`）。若浏览器右下角出现 **「需要网站所有者处理的错误：网站密钥的网域无效」**，说明 **当前页面的主机名未在该密钥的允许域名列表中**，与代码无关，需在 Google 侧补全域名。

**处理步骤：**

1. 打开 [Google reCAPTCHA 管理后台](https://www.google.com/recaptcha/admin)，选中对应 **站点密钥**（与 Vercel 中的 `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` 一致）。
2. 在 **网域**（Domains）中至少添加实际会访问到的主机名，例如：
   - 生产：`www.example.com`、`example.com`（若裸域与 www 都会访问，两者都要加）。
   - 本地开发：`localhost`（以及若用 IP 访问则加 `127.0.0.1`）。
   - Vercel **Preview**：每个预览 URL 形如 `xxx.vercel.app`，若与生产共用同一把密钥，需添加 `vercel.app` 或按需添加子域（Google 通常支持添加 `vercel.app` 作为后缀规则，以控制台为准）。
3. 保存后等待约 **1 分钟** 再硬刷新页面验证。

**临时关闭验证码（仅预览/调试，勿用于生产）：** 在 Vercel 环境变量中设置 `NEXT_PUBLIC_RECAPTCHA_DISABLED=1`，将不加载 reCAPTCHA 脚本、服务端也不校验 token。生产环境应通过 **正确配置网域** 解决，而不是长期关闭。

### 2.2 部署后自检清单（注册 / 管理）

1. 在 Vercel 中为 **Production** 以及实际在测的 **Preview** 勾选上述变量（仅配 Production 时，预览 URL 仍会缺 `SERVICE_ROLE` 或错误的 `NEXT_PUBLIC_*`）。
2. 发布后在 **Deployment → Logs / Observability** 中提交一次注册，确认无超时、无 Prisma 连接错误、无 Auth 401。
3. 浏览器 **DevTools → Network**：查看页面 POST（Server Action）是否 200；失败时看状态码与响应体。

---

## 3. 冷启动、函数时长与注册

- 新規登録は Supabase Admin API と Prisma 複数クエリを伴うため、冷スタート時は遅延しやすい。
- `src/app/(public)/manager/entry/page.tsx` では **`maxDuration`** を延ばしてタイムアウトによる切断を減らしている（プランにより上限は Vercel 側でクランプされる）。

---

## 4. 冷启动与体感速度（一般）

- 首次请求（冷启动）可能多出 1–2 秒，属正常。已通过 **admin loading 骨架** 和 **减少重复 Supabase 调用** 优化体感。
- 若 Supabase 与 Vercel 区域不一致，可考虑把 Vercel 或 Supabase 选在同一区域（如都选 Tokyo）以降低 RTT。

---

## 5. 参考

- [Supabase: Connecting to Postgres — Pooler transaction mode](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-transaction-mode)
- [Prisma: Configure PgBouncer (connection pooling)](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer)
