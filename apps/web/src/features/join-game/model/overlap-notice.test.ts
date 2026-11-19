import { describe, expect, it } from "vitest";

import { overlapNotice, OVERLAP_SINGLE_INTRO } from "./overlap-notice";
import type { OverlapSlot } from "./overlap-rejection";

const slot = (overrides: Partial<OverlapSlot> = {}): OverlapSlot => ({
  targetRoundNo: 3,
  gameTitle: "달빛 여관의 실종자",
  gameRoundCount: 1,
  roundNo: 1,
  startsAt: "2026-11-21T03:00:00.000Z",
  endsAt: "2026-11-21T07:00:00.000Z",
  ...overrides,
});

describe("overlapNotice", () => {
  it("둘 다 단발이면 지금 문구 그대로이고 줄이 없다", () => {
    expect(overlapNotice({ targetRoundCount: 1, overlaps: [slot({ targetRoundNo: 1 })] })).toEqual({
      intro: OVERLAP_SINGLE_INTRO,
      lines: [],
      moreLabel: null,
    });
  });

  it("신청하려는 구인이 다회차면 이 구인의 회차와 상대 제목을 보인다", () => {
    expect(overlapNotice({ targetRoundCount: 6, overlaps: [slot()] })).toEqual({
      intro: "이 구인의 3회차가 다른 세션과 겹칩니다.",
      lines: ["3회차 · 11월 21일 (토) 오후 12:00~4:00 ↔ 달빛 여관의 실종자"],
      moreLabel: null,
    });
  });

  it("내 다른 구인이 다회차면 상대 제목과 회차를 보인다", () => {
    expect(
      overlapNotice({
        targetRoundCount: 1,
        overlaps: [slot({ gameTitle: "마지막 열차", gameRoundCount: 8, roundNo: 7 })],
      }),
    ).toEqual({
      intro: "참여 중인 구인과 시간이 겹칩니다.",
      lines: ["마지막 열차 7회차 · 11월 21일 (토) 오후 12:00~4:00"],
      moreLabel: null,
    });
  });

  it("3건까지 보이고 나머지는 외 n건으로 줄인다", () => {
    const overlaps = [2, 3, 4, 5, 6].map((targetRoundNo) => slot({ targetRoundNo }));
    const result = overlapNotice({ targetRoundCount: 6, overlaps });
    expect(result.intro).toBe(
      "이 구인의 2회차, 3회차, 4회차, 5회차, 6회차가 다른 세션과 겹칩니다.",
    );
    expect(result.lines).toHaveLength(3);
    expect(result.moreLabel).toBe("외 2건");
  });
});
