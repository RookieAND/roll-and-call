import { describe, expect, it } from "vitest";

import { absencesError } from "./absences-error";

const rosterUserIds = ["a", "b"];

describe("absencesError", () => {
  it("명단 안의 사람이면 통과한다", () => {
    expect(absencesError({ absences: [{ userId: "a", reason: null }], rosterUserIds })).toBeNull();
  });

  it("명단 밖이거나 같은 사람이 두 번이면 막는다", () => {
    expect(absencesError({ absences: [{ userId: "c", reason: null }], rosterUserIds })).toBe(
      "명단에 없는 참여자입니다.",
    );
    expect(
      absencesError({
        absences: [
          { userId: "a", reason: null },
          { userId: "a", reason: "x" },
        ],
        rosterUserIds,
      }),
    ).toBe("명단에 없는 참여자입니다.");
  });

  it("사유는 앞뒤 공백을 빼고 200자까지다", () => {
    expect(
      absencesError({
        absences: [{ userId: "a", reason: ` ${"가".repeat(200)} ` }],
        rosterUserIds,
      }),
    ).toBeNull();
    expect(
      absencesError({ absences: [{ userId: "a", reason: "가".repeat(201) }], rosterUserIds }),
    ).toBe("불참 사유는 200자까지 쓸 수 있습니다.");
  });
});
