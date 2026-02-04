import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 检查环境变量是否存在，防止构建时出错
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // 环境变量未设置时，跳过认证检查
    return NextResponse.next();
  }

  // 1. 创建初始响应
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. 初始化 Supabase 客户端并同步 Cookie
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // 同时更新请求和响应的 Cookie，防止状态不同步
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // 3. 获取当前会话（不要使用 getSession，新版推荐 getUser 保证安全性）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 权限控制逻辑
  // 1. 如果访问 /admin 且未登录 -> 重定向到登录页
  if (url.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/manager/login", request.url));
  }

  // 2. 如果已登录用户尝试访问登录页 -> 重定向到后台首页
  if (url.pathname.startsWith("/manager/login") && user) {
    return NextResponse.redirect(new URL("/admin/magazines", request.url));
  }

  return response;
}

// ✨ Matcher 排除静态资源，提高性能
export const config = {
  matcher: [
    /*
     * 匹配所有需要校验的路径
     * 排除 _next/static, _next/image, favicon.ico 等静态文件
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
