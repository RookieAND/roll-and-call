import { describe, expect, it } from "vitest";

import { departedGmGameAction } from "./departed-gm-game-action";

const HOUR = 3_600_000;
const now = new Date("2026-10-03T12:00:00Z");
const game = (overrides: Partial<Parameters<typeof departedGmGameAction>[0]["game"]>) => ({
  confirmedAt: null,
  attendanceConfirmedAt: null,
  cancelledAt: null,
  ...overrides,
});

describe("departedGmGameAction", () => {
  it("시간 미정이거나 시작 전인 구인은 취소한다", () => {
    expect(departedGmGameAction({ game: game({}), now })).toBe("cancel");
    expect(
      departedGmGameAction({ game: game({ confirmedAt: new Date(now.getTime() + HOUR) }), now }),
    ).toBe("cancel");
  });

  it("시작했고 출석 확인 전인 세션은 전원 출석으로 확정한다", () => {
    expect(
      departedGmGameAction({ game: game({ confirmedAt: new Date(now.getTime() - HOUR) }), now }),
    ).toBe("confirm_attendance");
    expect(
      departedGmGameAction({
        game: game({ confirmedAt: new Date(now.getTime() - 48 * HOUR) }),
        now,
      }),
    ).toBe("confirm_attendance");
  });

  it("출석을 확정한 끝난 세션과 이미 취소한 구인은 그대로 둔다", () => {
    expect(
      departedGmGameAction({
        game: game({
          confirmedAt: new Date(now.getTime() - 48 * HOUR),
          attendanceConfirmedAt: now,
        }),
        now,
      }),
    ).toBe("keep");
    expect(departedGmGameAction({ game: game({ cancelledAt: now }), now })).toBe("keep");
  });
});
