import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "ATLD E-Learning - Hệ thống đào tạo An Toàn Lao Động",
        short_name: "ATLD E-Learning",
        description: "Hệ thống đào tạo trực tuyến chuyên nghiệp về An Toàn Lao Động",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
            {
                src: "/images/atld-logo.webp",
                sizes: "any",
                type: "image/webp",
            },
        ],
        categories: ["education", "training", "safety"],
        lang: "vi",
        orientation: "portrait-primary",
    };
}
