import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
    env: {
        NEXT_PUBLIC_APP_VERSION: packageJson.version,
    },
    experimental: {
        optimizePackageImports: [
            '@tabler/icons-react',
            '@mantine/core',
            '@mantine/dates',
            '@mantine/dropzone',
        ],
    },
    
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
    },
    
    // Compress output
    compress: true,
    
    // Optimize fonts
    optimizeFonts: true,
    
    // Production source maps (tắt để giảm bundle)
    productionBrowserSourceMaps: false,
    
    async redirects() {
        return [
            {
                source: "/",
                destination: "/landing-page",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
