import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: "/",
                destination: "/landing-page",
                permanent: true,
            },
        ];
    },
    experimental: {
        // Enable server actions for better upload handling
        serverActions: {
            bodySizeLimit: "500mb", // Match R2_CONFIG max file size
        },
    },
    // Increase API route body size limit
    api: {
        bodyParser: {
            sizeLimit: "500mb",
        },
    },
};

export default nextConfig;
