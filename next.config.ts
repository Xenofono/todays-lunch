import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ['pdf-parse'],
    typescript: {
        // `npm run build` type-checks with TypeScript 7 (`tsc`) before `next build`.
        // Next would otherwise re-check with the `typescript` package, which is
        // TypeScript 6 here so typescript-eslint keeps working.
        ignoreBuildErrors: true,
    },
    images:{
        remotePatterns: [
            new URL("https://gastrogate.com/files/**"),
            new URL("https://www.kvarnen.com/**"),
            new URL("https://bla-dorren.se/**"),
        ]
    }
};

export default nextConfig;
