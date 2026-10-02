import { serverPath } from "./server-path";

// 가입 화면 주소. 가입·온보딩을 마치면 next로, 없으면 그 서버 구인 목록으로 돌아간다.
export function serverJoinPath({ slug, next }: { slug: string; next?: string }) {
  const path = serverPath({ slug, path: "/join" });
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
