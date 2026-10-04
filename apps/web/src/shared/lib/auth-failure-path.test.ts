import { describe, expect, it } from "vitest";

import { authFailurePath } from "./auth-failure-path";

describe("authFailurePath", () => {
  it("서버 밖에서 출발했으면 인덱스에서 안내한다", () => {
    expect(authFailurePath("/")).toBe("/?auth_error=1");
    expect(authFailurePath("/about")).toBe("/about?auth_error=1");
    expect(authFailurePath("/help/find-and-join")).toBe("/?auth_error=1");
    expect(authFailurePath("/onboarding?next=%2Ftrpia%2Fgames")).toBe("/?auth_error=1");
  });

  it("예약어는 서버 slug로 보지 않는다", () => {
    expect(authFailurePath("/help")).toBe("/?auth_error=1");
    expect(authFailurePath("/about/x")).toBe("/?auth_error=1");
    expect(authFailurePath("/games/abc")).toBe("/?auth_error=1");
  });

  it("서버 화면에서 출발했으면 그 서버 가입 화면으로 보내고 원래 주소를 next로 남긴다", () => {
    expect(authFailurePath("/trpia/games/abc")).toBe(
      "/trpia/join?next=%2Ftrpia%2Fgames%2Fabc&auth_error=1",
    );
    expect(authFailurePath("/trpia")).toBe("/trpia/join?next=%2Ftrpia&auth_error=1");
    expect(authFailurePath("/trpia/games?status=open&sort=new")).toBe(
      "/trpia/join?next=%2Ftrpia%2Fgames%3Fstatus%3Dopen%26sort%3Dnew&auth_error=1",
    );
  });

  it("가입 화면에서 출발했으면 그 주소에 붙인다", () => {
    expect(authFailurePath("/trpia/join?next=%2Ftrpia%2Fme")).toBe(
      "/trpia/join?next=%2Ftrpia%2Fme&auth_error=1",
    );
    expect(authFailurePath("/trpia/join")).toBe("/trpia/join?auth_error=1");
  });
});
