// 배포 도메인이 없으면 undefined라 embed url을 생략한다.
export function gameUrl(id: string): string | undefined {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  return base ? `${base.replace(/\/$/, "")}/games/${id}` : undefined;
}
