import { describe, expect, it } from "vitest";

import { toDrawOutcome } from "./to-draw-outcome";

const participant = (
  userId: string,
  drawRoll: number | null,
  status: "confirmed" | "waiting" = "waiting",
  joinedAt = new Date("2026-09-01T00:00:00Z"),
) => ({
  userId,
  drawRoll,
  status,
  joinedAt,
  user: { username: userId, avatarUrl: null, bio: null },
});

const ids = (entries: { userId: string }[]) => entries.map((entry) => entry.userId);

describe("toDrawOutcome", () => {
  it("값이 낮은 순으로 정원만큼 확정 통에 넣는다", () => {
    const outcome = toDrawOutcome(
      [participant("a", 58), participant("b", 3), participant("c", 41), participant("d", 12)],
      2,
    );
    expect(ids(outcome.confirmed)).toEqual(["b", "d"]);
    expect(ids(outcome.waiting)).toEqual(["c", "a"]);
    expect(outcome.drawCount).toBe(2);
  });

  it("직접 확정한 사람은 값 없이 앞에 서고 뽑을 자리에서 빠진다", () => {
    const outcome = toDrawOutcome(
      [participant("gm-pick", null, "confirmed"), participant("b", 20), participant("c", 10)],
      2,
    );
    expect(ids(outcome.confirmed)).toEqual(["gm-pick", "c"]);
    expect(ids(outcome.waiting)).toEqual(["b"]);
  });

  it("적용 뒤 상태가 바뀌어도 굴린 값 순서로 가른다", () => {
    const outcome = toDrawOutcome(
      [participant("a", 5, "waiting"), participant("b", 90, "confirmed")],
      1,
    );
    expect(ids(outcome.confirmed)).toEqual(["a"]);
  });

  it("같은 값이면 먼저 신청한 사람이 앞선다", () => {
    const outcome = toDrawOutcome(
      [
        participant("late", 7, "waiting", new Date("2026-09-02T00:00:00Z")),
        participant("early", 7, "waiting", new Date("2026-09-01T00:00:00Z")),
      ],
      1,
    );
    expect(ids(outcome.confirmed)).toEqual(["early"]);
  });
});
