// 운영진 채널 글의 [어드민에서 열기] 링크. ADMIN_APP_URL(끝 슬래시 없이)이 비면 undefined라 버튼을 붙이지 않는다.
export function adminUrl({ slug, path }: { slug: string; path: string }): string | undefined {
  const base = process.env.ADMIN_APP_URL?.trim();
  return base ? `${base.replace(/\/$/, "")}/${slug}${path}` : undefined;
}
