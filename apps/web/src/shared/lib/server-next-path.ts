import { safeNextPath } from "./safe-next-path";
import { serverPath } from "./server-path";

// 가입·온보딩을 마치고 돌아갈 주소. 같은 서버 안의 경로(와 그 서버의 어드민 주소)만 받고, 아니면 그 서버 구인 목록으로 간다.
export function serverNextPath({ slug, value }: { slug: string; value: string | null }) {
  const fallback = serverPath({ slug, path: "/games" });
  const home = serverPath({ slug, path: "/" });
  const adminHome = `${process.env.NEXT_PUBLIC_ADMIN_APP_URL?.replace(/\/$/, "")}${home}`;
  // 어드민에서 가입하러 온 운영진은 같은 서버의 어드민 주소로 돌려보낸다.
  if (value === adminHome || value?.startsWith(`${adminHome}/`)) return value;
  const inServer = value === home || value?.startsWith(`${home}/`);
  return inServer ? safeNextPath({ value, fallback }) : fallback;
}
