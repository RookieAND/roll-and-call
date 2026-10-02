import { describe, expect, it } from "vitest";

import { legacyServerRedirect } from "./legacy-server-redirect";

const redirectOf = (pathname: string) => legacyServerRedirect({ pathname, defaultSlug: "trpia" });

describe("legacyServerRedirect", () => {
  it("옛 서버 화면 주소를 기본 서버로 영구 이동한다", () => {
    expect(redirectOf("/games/123/reviews")).toEqual({
      path: "/trpia/games/123/reviews",
      permanent: true,
    });
    expect(redirectOf("/me")).toEqual({ path: "/trpia/me", permanent: true });
  });

  it("옛 프로필 주소 /u를 /users로 옮긴다", () => {
    expect(redirectOf("/u/abc")).toEqual({ path: "/trpia/users/abc", permanent: true });
    expect(redirectOf("/u")).toEqual({ path: "/trpia/users", permanent: true });
    expect(redirectOf("/other/u/abc/sessions")).toEqual({
      path: "/other/users/abc/sessions",
      permanent: true,
    });
    expect(redirectOf("/other/u")).toEqual({ path: "/other/users", permanent: true });
  });

  it("서버 밖 화면과 이미 서버 주소인 경로는 그대로 둔다", () => {
    for (const pathname of [
      "/",
      "/help",
      "/onboarding",
      "/trpia/games",
      "/gamesx",
      "/api/me",
      "/api/u/x",
      "/trpia/ux",
      "/ux",
    ]) {
      expect(redirectOf(pathname)).toBeNull();
    }
  });
});
