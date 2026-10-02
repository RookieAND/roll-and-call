import { describe, expect, it } from "vitest";

import { serverNextPath } from "./server-next-path";

const nextOf = (value: string | null) => serverNextPath({ slug: "trpia", value });

describe("serverNextPath", () => {
  it("같은 서버 경로만 받는다", () => {
    expect(nextOf("/trpia")).toBe("/trpia");
    expect(nextOf("/trpia/games/1?tab=a")).toBe("/trpia/games/1?tab=a");
  });

  it("다른 서버·외부·빈 값은 그 서버 구인 목록으로 보낸다", () => {
    for (const value of [
      null,
      "",
      "/other/games",
      "/trpiax",
      "//evil.com",
      "https://evil.com",
      "/",
    ]) {
      expect(nextOf(value)).toBe("/trpia/games");
    }
  });
});
