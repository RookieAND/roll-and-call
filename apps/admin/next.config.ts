import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 다른 서버의 데이터에 손대면 forbidden()으로 403을 낸다.
  experimental: { authInterrupts: true },
  transpilePackages: [
    "@roll-and-call/ui",
    "@roll-and-call/database",
    "@roll-and-call/discord",
    "@roll-and-call/game-notices",
    "@roll-and-call/review-forum",
    "@roll-and-call/tiptap",
  ],
  // 후기는 구인 아래에서 독립 메뉴로 옮겼다(D212). 옛 주소는 308로 보내고 쿼리는 그대로 둔다.
  redirects: async () => [
    {
      source: "/:server/posts/reviews/:path*",
      destination: "/:server/reviews/:path*",
      permanent: true,
    },
  ],
};

export default nextConfig;
