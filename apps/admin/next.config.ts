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
    // 룰북 추가·요청 승인은 다이얼로그에서 별도 페이지로 옮겼다(D291). 쿼리(category, request)는 그대로 넘어간다.
    {
      source: "/:server/rules",
      has: [{ type: "query", key: "add", value: "1" }],
      destination: "/:server/rules/new",
      permanent: true,
    },
    {
      source: "/:server/rules",
      has: [{ type: "query", key: "action", value: "(add|approve)" }],
      destination: "/:server/rules/new",
      permanent: true,
    },
  ],
};

export default nextConfig;
