import { describe, expect, it } from "vitest";

import { isRosterRequest } from "./is-roster-request";

const UUID = "0b6f8a3e-2c1d-4e5f-8a9b-0c1d2e3f4a5b";

describe("isRosterRequest", () => {
  it("uuid 게임과 uuid 명단을 받는다", () => {
    expect(isRosterRequest({ gameId: UUID, userIds: [UUID] })).toBe(true);
    expect(isRosterRequest({ gameId: UUID, userIds: [] })).toBe(true);
  });

  it("모양이 틀린 id를 거른다", () => {
    expect(isRosterRequest({ gameId: "abc", userIds: [] })).toBe(false);
    expect(isRosterRequest({ gameId: UUID, userIds: ["abc"] })).toBe(false);
    expect(isRosterRequest({ gameId: UUID, userIds: UUID })).toBe(false);
  });

  it("명단이 40명을 넘으면 거른다", () => {
    expect(isRosterRequest({ gameId: UUID, userIds: Array.from({ length: 40 }, () => UUID) })).toBe(
      true,
    );
    expect(isRosterRequest({ gameId: UUID, userIds: Array.from({ length: 41 }, () => UUID) })).toBe(
      false,
    );
  });
});
