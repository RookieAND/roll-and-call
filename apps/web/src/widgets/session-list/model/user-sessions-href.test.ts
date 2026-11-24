import { describe, expect, it } from "vitest";

import { SESSION_ROLE } from "@/entities/game";

import { userSessionsHref } from "./user-sessions-href";

describe("userSessionsHref", () => {
  it("역할은 경로에, 진행·완료 탭은 ?tab=past에 둔다", () => {
    expect(userSessionsHref({ userId: "u", role: SESSION_ROLE.player })).toBe(
      "/users/u/sessions/player",
    );
    expect(userSessionsHref({ userId: "u", role: SESSION_ROLE.host, past: true })).toBe(
      "/users/u/sessions/host?tab=past",
    );
  });
});
