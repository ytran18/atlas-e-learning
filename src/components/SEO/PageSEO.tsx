import Head from "next/head";

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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://atld-elearning.com";
    const fullTitle = title ? `${title} | ATLD E-Learning` : "ATLD E-Learning";
    const fullDescription =
        description || "Hệ thống đào tạo trực tuyến chuyên nghiệp về An Toàn Lao Động";
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
    const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/images/atld-logo.webp`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            {keywords && <meta name="keywords" content={keywords.join(", ")} />}
            <meta name="author" content="ATLD E-Learning" />
            <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="ATLD E-Learning" />
            <meta property="og:locale" content="vi_VN" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            <meta name="twitter:image" content={fullImage} />

            {/* Canonical */}
            <link rel="canonical" href={canonical || fullUrl} />

            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData, null, 2),
                    }}
                />
            )}
        </Head>
    );
}
