import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@roll-and-call/ui",
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/review-forum",
    "@roll-and-call/tiptap",
  ],
};

export default nextConfig;
