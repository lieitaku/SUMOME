"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const ADMIN_ONLY_PREFIXES = [
  "/admin/clubs",
  "/admin/pickup-clubs",
  "/admin/activities",
  "/admin/magazines",
  "/admin/banners",
  "/admin/prefecture-banners",
  "/admin/inquiries",
  "/admin/settings",
];

function isAdminOnlyPath(pathname: string): boolean {
  if (pathname === "/admin" || pathname === "/admin/dashboard" || pathname === "/admin/my-club" || pathname === "/admin/applications") {
    return false;
  }
  return ADMIN_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

interface AdminRouteGuardProps {
  role: "ADMIN" | "OWNER";
  children: ReactNode;
}

/**
 * OWNER が管理者専用ルートにアクセスしたら /admin へリダイレクト
 */
export default function AdminRouteGuard({ role, children }: AdminRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (role !== "OWNER") return;
    if (isAdminOnlyPath(pathname)) {
      router.replace("/admin");
    }
  }, [role, pathname, router]);

  if (role === "OWNER" && isAdminOnlyPath(pathname)) {
    return null;
  }
  return <>{children}</>;
}
