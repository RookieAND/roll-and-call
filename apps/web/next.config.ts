import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  transpilePackages: [
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/game-notices",
    "@roll-and-call/review-forum",
    "@roll-and-call/ui",
    "@roll-and-call/tiptap",
  ],
  experimental: {
    optimizePackageImports: ["@roll-and-call/ui"],
  },
  images: {
    // 소스 하나당 변환이 기기 폭×DPR마다 생겨 한도를 먹는다. 카드 폭(412px)의 1~3배로만 묶는다.
    deviceSizes: [420, 840, 1260],
    imageSizes: [56, 112, 168],
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
