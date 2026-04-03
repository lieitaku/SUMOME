import { redirect } from "@/i18n/navigation";

// 访问 /admin 直接跳去 /admin/dashboard
export default function AdminIndexPage() {
    redirect("/admin/dashboard");
}