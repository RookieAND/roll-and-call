import { isServerSlug } from "@roll-and-call/database/servers/model";

import { serverJoinPath } from "./server-join-path";
import { serverPath } from "./server-path";

const AUTH_ERROR_PARAM = "auth_error";
const BASE = "http://localhost";

// 로그인에 실패하면 출발한 곳에서 안내한다(D105). 서버 화면은 비로그인이 머물 수 없어 그 서버 가입 화면으로 보내고, 원래 주소는 next로 남긴다.
export function authFailurePath(next: string): string {
  const withAuthError = (path: string) => {
    const url = new URL(path, BASE);
    url.searchParams.set(AUTH_ERROR_PARAM, "1");
    return `${url.pathname}${url.search}`;
  };
  const { pathname } = new URL(next, BASE);
  const [, slug] = pathname.split("/");
  if (!isServerSlug(slug)) return withAuthError(pathname === "/about" ? "/about" : "/");
  if (pathname === serverPath({ slug, path: "/join" })) return withAuthError(next);
  return withAuthError(serverJoinPath({ slug, next }));
}
