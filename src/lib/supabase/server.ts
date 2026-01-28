import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 注意：这里变成了 async function
export async function createClient() {
  // 关键修改：加上 await
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component 无法写入 cookie，忽略此错误
          }
        },
      },
    }
  )
}