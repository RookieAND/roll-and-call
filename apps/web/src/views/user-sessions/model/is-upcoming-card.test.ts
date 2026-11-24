import { describe, expect, it, vi } from "vitest";

import { SESSION_CHIP, type SessionCardModel } from "@/widgets/session-list";

import { isUpcomingCard } from "./is-upcoming-card";

vi.mock("server-only", () => ({}));

const NOW = new Date("2026-11-24T12:00:00+09:00");
const card = (partial: Partial<SessionCardModel>) =>
  ({
    cancelled: false,
    chip: SESSION_CHIP.confirmed,
    startsAt: null,
    ...partial,
  }) as SessionCardModel;

describe("isUpcomingCard", () => {
  it("시작 전이거나 일정 미정이면 예정이다", () => {
    expect(
      isUpcomingCard({ card: card({ startsAt: "2026-11-25T10:00:00+09:00" }), now: NOW }),
    ).toBe(true);
    expect(isUpcomingCard({ card: card({}), now: NOW })).toBe(true);
  });

  it("진행 중·끝남·취소는 예정이 아니다", () => {
    expect(
      isUpcomingCard({ card: card({ startsAt: "2026-11-24T10:00:00+09:00" }), now: NOW }),
    ).toBe(false);
    expect(isUpcomingCard({ card: card({ chip: SESSION_CHIP.ended }), now: NOW })).toBe(false);
    expect(isUpcomingCard({ card: card({ cancelled: true }), now: NOW })).toBe(false);
  });
});
