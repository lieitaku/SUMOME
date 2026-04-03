import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
    const t = await getTranslations("NotFound");
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-sumo-text font-serif">{t("title")}</h1>
            <p className="text-gray-600 max-w-md text-sm md:text-base leading-relaxed">{t("description")}</p>
            <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-sumo-brand px-8 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 ease-in-out hover:brightness-110 active:scale-[0.98]"
            >
                {t("home")}
            </Link>
        </div>
    );
}
