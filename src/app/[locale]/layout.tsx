import type { Metadata } from "next";
import {
    Noto_Serif_JP,
    Noto_Sans_JP,
    Cormorant_Garamond,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { TransitionProvider } from "@/context/TransitionContext";
import PageLoader from "@/components/ui/PageLoader";

const notoSerif = Noto_Serif_JP({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
    variable: "--font-noto-serif",
    display: "swap",
});

const notoSans = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
    variable: "--font-noto-sans",
    display: "swap",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    variable: "--font-cormorant",
    display: "swap",
});

const FAVICON_VERSION = "6";

function getMetadataBase(): URL {
    if (process.env.NODE_ENV === "development") {
        const port = process.env.PORT || "3000";
        const protocol = process.env.__NEXT_EXPERIMENTAL_HTTPS ? "https" : "http";
        return new URL(`${protocol}://localhost:${port}`);
    }
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
    if (envUrl) {
        try {
            return new URL(envUrl);
        } catch {
            /* ignore */
        }
    }
    if (process.env.VERCEL_URL) {
        return new URL(`https://${process.env.VERCEL_URL}`);
    }
    return new URL("https://www.memory-sumo.com");
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Meta" });
    const base = getMetadataBase();
    const canonicalPath = locale === routing.defaultLocale ? "/" : "/en";
    const keywords = t("keywords")
        .split(/[,，]/)
        .map((k) => k.trim())
        .filter(Boolean);

    return {
        metadataBase: base,
        verification: {
            google: "0hQ6bhAEpUdJ_Knewca79UXs6SunCcR-CdcNelcNHJA",
        },
        title: {
            default: t("titleDefault"),
            template: t("titleTemplate"),
        },
        description: t("description"),
        keywords,
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: base.toString().replace(/\/$/, ""),
            siteName: "SUMOME",
            type: "website",
            locale: locale === "en" ? "en_US" : "ja_JP",
        },
        twitter: {
            card: "summary_large_image",
            title: t("twitterTitle"),
            description: t("twitterDescription"),
        },
        alternates: {
            canonical: `${base.origin}${canonicalPath === "/" ? "/" : canonicalPath}`,
            languages: {
                ja: `${base.origin}/`,
                en: `${base.origin}/en`,
            },
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;
    if (!routing.locales.includes(locale as "ja" | "en")) {
        notFound();
    }
    setRequestLocale(locale);
    const messages = await getMessages();

    const v = FAVICON_VERSION;
    const htmlLang = locale === "en" ? "en" : "ja";

    return (
        <html lang={htmlLang} suppressHydrationWarning>
            <head>
                <link rel="icon" type="image/x-icon" href={`/favicon.ico?v=${v}`} />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href={`/icons/favicon-96x96.png?v=${v}`}
                />
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/icons/sumo-favicon.ico?v=${v}`}
                    sizes="48x48"
                />
                <link rel="shortcut icon" href={`/icons/sumo-favicon.ico?v=${v}`} />
                <link rel="apple-touch-icon" href={`/icons/apple-touch-icon.png?v=${v}`} />
                <link rel="manifest" href={`/site.webmanifest?v=${v}`} />
            </head>
            <body
                className={`${notoSerif.variable} ${notoSans.variable} ${cormorant.variable} font-sans bg-sumo-bg text-sumo-text antialiased selection:bg-sumo-brand selection:text-white`}
            >
                <NextIntlClientProvider messages={messages}>
                    <TransitionProvider>
                        <PageLoader />
                        {children}
                    </TransitionProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
