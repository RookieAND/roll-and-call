import { safeNextPath } from "./safe-next-path";
import { serverPath } from "./server-path";

// 가입·온보딩을 마치고 돌아갈 주소. 같은 서버 안의 경로만 받고, 아니면 그 서버 구인 목록으로 간다.
export function serverNextPath({ slug, value }: { slug: string; value: string | null }) {
  const fallback = serverPath({ slug, path: "/games" });
  const home = serverPath({ slug, path: "/" });
  const inServer = value === home || value?.startsWith(`${home}/`);
  return inServer ? safeNextPath({ value, fallback }) : fallback;
}
