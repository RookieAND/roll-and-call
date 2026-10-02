import { serverPath } from "./server-path";

// 가입 화면 주소. 가입·온보딩을 마치면 next로 돌아간다.
export function serverJoinPath({ slug, next }: { slug: string; next: string }) {
  return `${serverPath({ slug, path: "/join" })}?next=${encodeURIComponent(next)}`;
}
