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
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`：前端与 Middleware 认证用。

生产环境不要提交 `.env`，只在 Vercel 里配置。

---

## 3. 冷启动与体感速度

- 首次请求（冷启动）可能多出 1–2 秒，属正常。已通过 **admin loading 骨架** 和 **减少重复 Supabase 调用** 优化体感。
- 若 Supabase 与 Vercel 区域不一致，可考虑把 Vercel 或 Supabase 选在同一区域（如都选 Tokyo）以降低 RTT。

---

## 4. 参考

- [Supabase: Connecting to Postgres — Pooler transaction mode](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-transaction-mode)
- [Prisma: Configure PgBouncer (connection pooling)](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer)
