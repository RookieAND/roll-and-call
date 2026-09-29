import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  transpilePackages: [
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/review-forum",
    "@roll-and-call/ui",
    "@roll-and-call/tiptap",
  ],
  experimental: {
    optimizePackageImports: ["@roll-and-call/ui"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
