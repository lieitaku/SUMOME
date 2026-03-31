import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdmin: SupabaseClient | null = null;

/**
 * 懒加载 Admin 客户端，避免在缺少环境变量时于「模块加载阶段」抛出难读的 supabaseKey is required。
 * Vercel 必须配置：SUPABASE_SERVICE_ROLE_KEY（Supabase → Project Settings → API → service_role）。
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL が未設定です。Vercel の Environment Variables を確認してください。",
    );
  }
  if (!serviceKey) {
    throw new Error(
      "[Supabase] SUPABASE_SERVICE_ROLE_KEY が未設定です。Vercel → Settings → Environment Variables に、Supabase Dashboard → API の service_role（secret）を SUPABASE_SERVICE_ROLE_KEY という名前で追加し、再デプロイしてください。",
    );
  }

  if (!cachedAdmin) {
    cachedAdmin = createClient(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return cachedAdmin;
}

/** 既存 import を維持。初回プロパティアクセス時に getSupabaseAdmin() 相当のクライアントを返す */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseAdmin();
    return Reflect.get(client, prop, receiver);
  },
});
