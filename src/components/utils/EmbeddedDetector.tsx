"use client";

import { useEffect } from "react";

/**
 * When the page is loaded in the preview modal iframe (?embedded=1),
 * adds a class to body so we can hide/adjust elements (e.g. ScrollToTop, footer edge).
 */
export default function EmbeddedDetector() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("embedded") === "1") {
            document.body.classList.add("preview-embedded");
        }
        return () => {
            document.body.classList.remove("preview-embedded");
        };
    }, []);
    return null;
}
