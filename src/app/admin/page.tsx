import { redirect } from "next/navigation";

// 访问 /admin 直接跳去 /admin/dashboard
export default function AdminIndexPage() {
    redirect("/admin/dashboard");
}