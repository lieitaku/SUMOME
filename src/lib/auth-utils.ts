import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { cache } from "react";

/** 校验是否为 ADMIN 角色 (Memoized) */
export const confirmAdmin = cache(async () => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // 校验是否为 ADMIN 角色
  if (user?.role !== "ADMIN") return null;

  return user;
});

/** 获取当前登录用户（含角色），未登录或无 DB 记录时返回 null (Memoized) */
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, role: true },
  });

  return user;
});