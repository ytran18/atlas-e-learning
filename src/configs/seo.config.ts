import type { Metadata } from "next";

// Base SEO configuration
export const baseSeoConfig = {
    siteName: "ATLD E-Learning",
    siteUrl:
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NODE_ENV === "production"
            ? "https://antoanlaodongso.com"
            : "https://staging.antoanlaodongso.com"),
    defaultTitle: "Hệ thống đào tạo An Toàn Lao Động",
    defaultDescription: "Hệ thống đào tạo trực tuyến chuyên nghiệp về An Toàn Lao Động. Cung cấp các khóa học chất lượng cao, chứng chỉ uy tín và trải nghiệm học tập hiệu quả. Đăng ký ngay hôm nay với ưu đãi đặc biệt!",
    defaultKeywords: [
        "an toàn lao động",
        "đào tạo an toàn",
        "khóa học an toàn lao động",
        "chứng chỉ an toàn",
        "e-learning",
        "học trực tuyến",
        "ATLD",
        "AGK Safety",
        "safety training",
        "workplace safety",
        "đăng ký khóa học",
        "giảm giá 50%",
        "an toàn vệ sinh lao động"
    ],
    author: "ATLD E-Learning",
    locale: "vi_VN",
    type: "website",
    twitter: {
        card: "summary_large_image",
        site: "@atld_elearning",
        creator: "@atld_elearning"
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        siteName: "ATLD E-Learning"
    }
};

// Generate metadata helper
export function generateMetadata({
    title,
    description,
    keywords,
    image,
    url,
    noIndex = false,
    canonical
}: {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    noIndex?: boolean;
    canonical?: string;
}): Metadata {
    const fullTitle = title ? `${title} | ${baseSeoConfig.defaultTitle}` : baseSeoConfig.defaultTitle;
    const fullDescription = description || baseSeoConfig.defaultDescription;
    const fullKeywords = keywords ? [...baseSeoConfig.defaultKeywords, ...keywords] : baseSeoConfig.defaultKeywords;
    const fullUrl = url ? `${baseSeoConfig.siteUrl}${url}` : baseSeoConfig.siteUrl;
    const fullImage = image ? `${baseSeoConfig.siteUrl}${image}` : `${baseSeoConfig.siteUrl}/images/banner.jpg`;

    const metadata: Metadata = {
        title: fullTitle,
        description: fullDescription,
        keywords: fullKeywords,
        authors: [{ name: baseSeoConfig.author }],
        creator: baseSeoConfig.author,
        publisher: baseSeoConfig.author,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(baseSeoConfig.siteUrl),
        alternates: {
            canonical: canonical || fullUrl,
        },
        openGraph: {
            title: fullTitle,
            description: fullDescription,
            url: fullUrl,
            siteName: baseSeoConfig.siteName,
            images: [
                {
                    url: fullImage,
                    width: 1200,
                    height: 630,
                    alt: fullTitle.includes("ATLD") ? "Banner khóa học An Toàn Lao Động - AGK Safety" : fullTitle,
                },
            ],
            locale: baseSeoConfig.locale,
            type: "website" as const,
        },
        twitter: {
            card: "summary_large_image" as const,
            title: fullTitle,
            description: fullDescription,
            images: [fullImage],
            site: baseSeoConfig.twitter.site,
            creator: baseSeoConfig.twitter.creator,
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        yandex: process.env.YANDEX_VERIFICATION,
        yahoo: process.env.YAHOO_VERIFICATION,
    },
    };

    return metadata;
}

// Page-specific SEO configurations
export const pageSeoConfigs = {
    landing: {
        title: "Trang chủ",
        description: "Khám phá hệ thống đào tạo An Toàn Lao Động hàng đầu Việt Nam. Học trực tuyến, nhận chứng chỉ uy tín và nâng cao kỹ năng an toàn lao động.",
        keywords: ["trang chủ", "giới thiệu", "khóa học an toàn lao động"],
        url: "/landing-page"
    },
    signIn: {
        title: "Đăng nhập",
        description: "Đăng nhập vào hệ thống đào tạo An Toàn Lao Động để tiếp tục học tập và quản lý khóa học của bạn.",
        keywords: ["đăng nhập", "login", "tài khoản"],
        url: "/sign-in"
    },
    signUp: {
        title: "Đăng ký",
        description: "Tạo tài khoản mới để bắt đầu hành trình học tập An Toàn Lao Động. Đăng ký miễn phí và truy cập các khóa học chất lượng.",
        keywords: ["đăng ký", "register", "tạo tài khoản"],
        url: "/sign-up"
    },
    atld: {
        title: "Khóa học An Toàn Lao Động",
        description: "Danh sách các khóa học An Toàn Lao Động chuyên nghiệp. Học trực tuyến, thực hành và nhận chứng chỉ uy tín.",
        keywords: ["khóa học ATLD", "an toàn lao động", "đào tạo ATLD"],
        url: "/atld"
    },
    hocNghe: {
        title: "Khóa học Học Nghề",
        description: "Các khóa học nghề nghiệp chuyên sâu. Nâng cao kỹ năng nghề nghiệp và mở rộng cơ hội việc làm.",
        keywords: ["học nghề", "khóa học nghề", "đào tạo nghề"],
        url: "/hoc-nghe"
    },
    coursePreview: {
        title: "Xem trước khóa học",
        description: "Xem trước nội dung khóa học trước khi đăng ký. Tìm hiểu chi tiết về chương trình học và lợi ích.",
        keywords: ["xem trước", "preview", "thông tin khóa học"]
    },
    learn: {
        title: "Học tập",
        description: "Trang học tập trực tuyến với video bài giảng, tài liệu và bài tập thực hành.",
        keywords: ["học tập", "video bài giảng", "tài liệu học"],
        noIndex: true
    },
    verify: {
        title: "Xác thực",
        description: "Xác thực danh tính và hoàn thành khóa học để nhận chứng chỉ.",
        keywords: ["xác thực", "chứng chỉ", "hoàn thành khóa học"],
        noIndex: true
    },
    cameraCapture: {
        title: "Chụp ảnh",
        description: "Chụp ảnh xác thực danh tính cho khóa học.",
        keywords: ["chụp ảnh", "xác thực", "camera"],
        noIndex: true
    },
    exampleUpload: {
        title: "Ví dụ Upload",
        description: "Trang demo tính năng upload video.",
        keywords: ["upload", "demo", "video"],
        noIndex: true
    }
};

// Generate structured data for courses
export function generateCourseStructuredData(course: {
    id: string;
    title: string;
    description: string;
    instructor?: string;
    duration?: string;
    price?: number;
    image?: string;
    url: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: {
            "@type": "Organization",
            name: baseSeoConfig.siteName,
            url: baseSeoConfig.siteUrl
        },
        instructor: course.instructor ? {
            "@type": "Person",
            name: course.instructor
        } : undefined,
        courseMode: "online",
        educationalLevel: "beginner",
        inLanguage: "vi",
        url: `${baseSeoConfig.siteUrl}${course.url}`,
        image: course.image ? `${baseSeoConfig.siteUrl}${course.image}` : `${baseSeoConfig.siteUrl}/images/banner.jpg`,
        offers: course.price ? {
            "@type": "Offer",
            price: course.price,
            priceCurrency: "VND",
            availability: "https://schema.org/InStock"
        } : undefined
    };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: baseSeoConfig.siteName,
        url: baseSeoConfig.siteUrl,
        logo: `${baseSeoConfig.siteUrl}/images/banner.jpg`,
        description: baseSeoConfig.defaultDescription,
        address: {
            "@type": "PostalAddress",
            addressCountry: "VN",
            addressLocality: "Vietnam"
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "Vietnamese"
        },
        sameAs: [
            // Add social media URLs here when available
        ]
    };
}
