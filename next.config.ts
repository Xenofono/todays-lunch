import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ['pdf-parse'],
    images:{
        remotePatterns: [
            new URL("https://gastrogate.com/files/**"),
            new URL("https://www.kvarnen.com/**"),
        ]
    }
};

export default nextConfig;
