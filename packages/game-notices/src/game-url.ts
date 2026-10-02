// 디스코드 메시지처럼 사이트 밖에서 여는 사용자 앱의 구인 상세 주소.
// 어드민에서 부를 때는 NEXT_PUBLIC_USER_APP_URL이 사용자 앱 주소다. 사용자 앱은 그 값을 두지 않아 NEXT_PUBLIC_SITE_URL을 쓴다.
// 배포 도메인이 없으면 undefined라 링크를 생략한다.
export function gameUrl({ slug, gameId }: { slug: string; gameId: string }): string | undefined {
  const base =
    process.env.NEXT_PUBLIC_USER_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return base ? `${base.replace(/\/$/, "")}/${slug}/games/${gameId}` : undefined;
}
