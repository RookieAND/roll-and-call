import { describe, expect, it } from "vitest";

import { serverPath } from "./server-path";

describe("serverPath", () => {
  it("서버 안 경로에는 slug를 붙이고, 카탈로그 경로는 그대로 둔다", () => {
    expect(serverPath({ slug: "trpia", path: "/" })).toBe("/trpia");
    expect(serverPath({ slug: "trpia", path: "/users/1" })).toBe("/trpia/users/1");
    expect(serverPath({ slug: "trpia", path: "/platform/catalog?add=1" })).toBe(
      "/platform/catalog?add=1",
    );
  });
});
