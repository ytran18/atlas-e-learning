import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://atld-elearning.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/admin/",
                    "/atld/*/learn/",
                    "/atld/*/verify/",
                    "/hoc-nghe/*/learn/",
                    "/hoc-nghe/*/verify/",
                    "/camera-capture/",
                    "/example-upload/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
