import { serverPath } from "@/shared/lib";

import { siteOrigin } from "./site-origin";

// 디스코드 메시지처럼 사이트 밖에서 여는 구인 상세 주소.
export function gameUrl({ slug, gameId }: { slug: string; gameId: string }): string | undefined {
  const origin = siteOrigin();
  return origin ? `${origin}${serverPath({ slug, path: `/games/${gameId}` })}` : undefined;
}
