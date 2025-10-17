import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ['@tabler/icons-react'],
    },
    
    // Optimize images
    images: {
        formats: ['image/webp', 'image/avif'],
    },
    
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
