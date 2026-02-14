import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import GuidePageClient from "./GuidePageClient";

export default async function GuidePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    const role = user.role === "ADMIN" ? "ADMIN" : "OWNER";

    return <GuidePageClient userRole={role} />;
}
