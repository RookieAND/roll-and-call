import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@roll-and-call/ui", "@roll-and-call/database", "@roll-and-call/tiptap"],
};

export default nextConfig;
