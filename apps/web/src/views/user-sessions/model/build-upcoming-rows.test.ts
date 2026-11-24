import { describe, expect, it, vi } from "vitest";

import { GAME_STATUS, type SessionGame } from "@/entities/game";
import { SESSION_CHIP, type SessionCardModel } from "@/widgets/session-list";

import { buildUpcomingRows } from "./build-upcoming-rows";

vi.mock("server-only", () => ({}));

const NOW = new Date("2026-11-24T12:00:00+09:00");
const card = (id: string, partial: Partial<SessionCardModel> = {}) =>
  ({
    id,
    title: id,
    cancelled: false,
    hidden: false,
    chip: SESSION_CHIP.confirmed,
    startsAt: null,
    thumbnailUrl: null,
    thumbnailSpoiler: false,
    content: { capacity: { status: GAME_STATUS.recruiting } },
    ...partial,
  }) as SessionCardModel;
const game = (id: string) =>
  ({ id, rule: "크툴루", roundCount: 2, playMinutes: 120 }) as SessionGame;

describe("buildUpcomingRows", () => {
  it("예정 카드만 시작 순으로 담고 일정 없는 줄은 뒤로 보낸다", () => {
    const rows = buildUpcomingRows({
      cards: [
        card("none"),
        card("late", { startsAt: "2026-11-30T10:00:00+09:00" }),
        card("soon", { startsAt: "2026-11-25T10:00:00+09:00" }),
        card("past", { startsAt: "2026-11-20T10:00:00+09:00", chip: SESSION_CHIP.ended }),
        card("hidden", { startsAt: "2026-11-26T10:00:00+09:00", hidden: true }),
      ],
      games: ["none", "late", "soon", "past", "hidden"].map(game),
      now: NOW,
    });
    expect(rows.map((row) => row.id)).toEqual(["soon", "late", "none"]);
  });

  it("끝 시각은 시작에 플레이타임을 더하고 모집 중 여부를 담는다", () => {
    const [row] = buildUpcomingRows({
      cards: [card("a", { startsAt: "2026-11-25T10:00:00+09:00" })],
      games: [game("a")],
      now: NOW,
    });
    expect(row?.endsAt?.toISOString()).toBe(new Date("2026-11-25T12:00:00+09:00").toISOString());
    expect(row?.recruiting).toBe(true);
    expect(row?.roundCount).toBe(2);
  });
});
