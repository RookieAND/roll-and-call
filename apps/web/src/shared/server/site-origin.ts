// 배포 도메인이 없으면 undefined라 절대 URL이 필요한 곳(embed, OG)을 생략한다.
export function siteOrigin(): string | undefined {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return base?.replace(/\/$/, "");
}
