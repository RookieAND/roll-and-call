import { isServerSlug } from "@roll-and-call/database/servers/model";

import { isUuid } from "./is-uuid";

const LEGACY_PREFIXES = ["/games", "/me"] as const;
const LEGACY_PROFILE = "u";

// 서버 주소(/{slug})가 생기기 전의 경로를 기본 서버로, 옛 프로필 주소(…/u/…)를 …/users/…로 옮긴다.
// 구인 상세(/games/{uuid}…)는 그 구인의 서버를 DB에서 찾아야 해서 app/games/[id] 라우트가 맡는다.
export function legacyServerRedirect({
  pathname,
  defaultSlug,
}: {
  pathname: string;
  defaultSlug: string;
}): { path: string; permanent: boolean } | null {
  const [, first, second] = pathname.split("/");
  if (first === "games" && isUuid(second)) return null;
  if (first === LEGACY_PROFILE) {
    return { path: `/${defaultSlug}/users${pathname.slice(2)}`, permanent: true };
  }
  if (isServerSlug(first) && second === LEGACY_PROFILE) {
    return { path: `/${first}/users${pathname.slice(first.length + 3)}`, permanent: true };
  }
  const isLegacy = LEGACY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  return isLegacy ? { path: `/${defaultSlug}${pathname}`, permanent: true } : null;
}
