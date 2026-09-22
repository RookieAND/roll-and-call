import type { NextConfig } from "next";

const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  transpilePackages: [
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/ui",
    "@roll-and-call/tiptap",
  ],
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
