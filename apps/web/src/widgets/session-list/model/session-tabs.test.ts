import { describe, expect, it } from "vitest";

import { SESSION_ROLE } from "@/entities/game";

import { countableCards } from "./countable-cards";
import { isOngoingCard } from "./is-ongoing-card";
import { SESSION_CHIP } from "./session-card-model";
import { SESSION_CHIPS } from "./session-tabs";

const cards = [
  { chip: SESSION_CHIP.scheduling, cancelled: false },
  { chip: SESSION_CHIP.confirmed, cancelled: false },
  { chip: SESSION_CHIP.waiting, cancelled: false },
  { chip: SESSION_CHIP.recruiting, cancelled: false },
  { chip: SESSION_CHIP.ended, cancelled: false },
  { chip: SESSION_CHIP.ended, cancelled: true },
];

describe("진행 중 칩과 건수", () => {
  it("진행 중은 끝나지 않은 카드 전부다", () => {
    expect(cards.filter(isOngoingCard).map((card) => card.chip)).toEqual([
      SESSION_CHIP.scheduling,
      SESSION_CHIP.confirmed,
      SESSION_CHIP.waiting,
      SESSION_CHIP.recruiting,
    ]);
  });

  it("건수에서 취소된 카드를 뺀다", () => {
    expect(countableCards(cards)).toHaveLength(5);
  });

  it("운영 탭에는 모집 중 칩이 없다", () => {
    expect(SESSION_CHIPS[SESSION_ROLE.host].map((chip) => chip.label)).toEqual([
      "진행 중",
      "조율 중",
      "확정",
      "종료",
    ]);
  });
});
