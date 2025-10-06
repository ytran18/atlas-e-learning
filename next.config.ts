import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
