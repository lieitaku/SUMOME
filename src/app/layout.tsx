import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

const FAVICON_VERSION = "6";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <head>
                <link rel="icon" type="image/x-icon" href={`/favicon.ico?v=${FAVICON_VERSION}`} />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="96x96"
                    href={`/icons/favicon-96x96.png?v=${FAVICON_VERSION}`}
                />
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`/icons/sumo-favicon.ico?v=${FAVICON_VERSION}`}
                    sizes="48x48"
                />
                <link rel="shortcut icon" href={`/icons/sumo-favicon.ico?v=${FAVICON_VERSION}`} />
                <link rel="apple-touch-icon" href={`/icons/apple-touch-icon.png?v=${FAVICON_VERSION}`} />
                <link rel="manifest" href={`/site.webmanifest?v=${FAVICON_VERSION}`} />
            </head>
            <body>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
