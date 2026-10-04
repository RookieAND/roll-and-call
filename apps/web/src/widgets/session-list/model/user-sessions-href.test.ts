import { describe, expect, it } from "vitest";

import { SESSION_ROLE } from "@/entities/game";

import { userSessionsHref } from "./user-sessions-href";

describe("userSessionsHref", () => {
  it("참여 탭이 기본 주소이고 운영 탭은 ?tab=host다", () => {
    expect(userSessionsHref({ userId: "u", role: SESSION_ROLE.player })).toBe("/users/u/sessions");
    expect(userSessionsHref({ userId: "u", role: SESSION_ROLE.host })).toBe(
      "/users/u/sessions?tab=host",
    );
  });
});
