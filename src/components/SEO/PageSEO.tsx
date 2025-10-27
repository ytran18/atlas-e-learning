"use client";

import { useEffect } from "react";

interface PageSEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    noIndex?: boolean;
    canonical?: string;
    structuredData?: Record<string, any>;
}

export function PageSEO({
    title,
    description,
    keywords,
    image,
    url,
    noIndex = false,
    canonical,
    structuredData,
}: PageSEOProps) {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NODE_ENV === "production"
            ? "https://antoanlaodongso.com"
            : "https://staging.antoanlaodongso.com");
    const fullTitle = title ? `${title} | ATLD E-Learning` : "ATLD E-Learning";
    const fullDescription =
        description || "Hệ thống đào tạo trực tuyến chuyên nghiệp về An Toàn Lao Động";
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
    const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/images/banner.jpg`;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", fullDescription);
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = fullDescription;
            document.head.appendChild(meta);
        }

        // Update keywords
        if (keywords && keywords.length > 0) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute("content", keywords.join(", "));
            } else {
                const meta = document.createElement("meta");
                meta.name = "keywords";
                meta.content = keywords.join(", ");
                document.head.appendChild(meta);
            }
        }

        // Update robots
        const metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots) {
            metaRobots.setAttribute("content", noIndex ? "noindex,nofollow" : "index,follow");
        } else {
            const meta = document.createElement("meta");
            meta.name = "robots";
            meta.content = noIndex ? "noindex,nofollow" : "index,follow";
            document.head.appendChild(meta);
        }

        // Update canonical
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute("href", canonical || fullUrl);
        } else {
            const link = document.createElement("link");
            link.rel = "canonical";
            link.href = canonical || fullUrl;
            document.head.appendChild(link);
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute("content", fullTitle);
        } else {
            const meta = document.createElement("meta");
            meta.setAttribute("property", "og:title");
            meta.content = fullTitle;
            document.head.appendChild(meta);
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute("content", fullDescription);
        } else {
            const meta = document.createElement("meta");
            meta.setAttribute("property", "og:description");
            meta.content = fullDescription;
            document.head.appendChild(meta);
        }

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
            ogUrl.setAttribute("content", fullUrl);
        } else {
            const meta = document.createElement("meta");
            meta.setAttribute("property", "og:url");
            meta.content = fullUrl;
            document.head.appendChild(meta);
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute("content", fullImage);
        } else {
            const meta = document.createElement("meta");
            meta.setAttribute("property", "og:image");
            meta.content = fullImage;
            document.head.appendChild(meta);
        }

        // Add structured data
        if (structuredData) {
            // Remove existing structured data
            const existingScript = document.querySelector('script[type="application/ld+json"]');
            if (existingScript) {
                existingScript.remove();
            }

            const script = document.createElement("script");
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(structuredData, null, 2);
            document.head.appendChild(script);
        }
    }, [
        fullTitle,
        fullDescription,
        keywords,
        fullUrl,
        fullImage,
        noIndex,
        canonical,
        structuredData,
    ]);

    return null;
}
