import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

// 访问 /admin 直接跳去 /admin/dashboard（next-intl v4+ redirect 须传入 { href, locale }）
export default async function AdminIndexPage() {
    const locale = await getLocale();
    redirect({ href: "/admin/dashboard", locale });
}