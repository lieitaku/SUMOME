import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth-utils";
import GuidePageClient from "./GuidePageClient";

export default async function GuidePage() {
    const locale = await getLocale();
    const userRecord = await getCurrentUser();
    if (!userRecord) redirect({ href: "/manager/login", locale });
    const user = userRecord!;

    const role = user.role === "ADMIN" ? "ADMIN" : "OWNER";

    return <GuidePageClient userRole={role} />;
}
