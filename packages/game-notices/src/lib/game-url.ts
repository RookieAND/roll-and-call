import { siteBaseUrl } from "./site-base-url";

// 디스코드 메시지처럼 사이트 밖에서 여는 사용자 앱의 구인 상세 주소.
// 배포 도메인이 없으면 undefined라 링크를 생략한다.
export function gameUrl({ slug, gameId }: { slug: string; gameId: string }): string | undefined {
  const base = siteBaseUrl();
  return base ? `${base}/${slug}/games/${gameId}` : undefined;
}
