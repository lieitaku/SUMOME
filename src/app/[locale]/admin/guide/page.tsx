import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import GuidePageClient from "./GuidePageClient";

export default async function GuidePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/manager/login");

    const role = user.role === "ADMIN" ? "ADMIN" : "OWNER";

    return <GuidePageClient userRole={role} />;
}
