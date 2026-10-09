import { describe, expect, it } from "vitest";

import { finishSelectionLines } from "./finish-selection-lines";

const base = { applicantCount: 12, isFull: false, block: null, minPlayers: null } as const;

describe("finishSelectionLines", () => {
  it("기본은 신청자 수 안내 한 줄", () => {
    expect(finishSelectionLines(base)).toEqual(["신청한 12명 중에서 골라 주세요."]);
  });

  it("정원이 찼으면 대기 안내", () => {
    expect(finishSelectionLines({ ...base, isFull: true })).toEqual([
      "정원이 모두 찼습니다. 마치면 남은 신청자는 대기로 옮깁니다.",
    ]);
  });

  it("확정 0명이면 안내 아래에 이유", () => {
    expect(finishSelectionLines({ ...base, block: "no_confirmed" })).toEqual([
      "신청한 12명 중에서 골라 주세요.",
      "확정할 사람을 1명 이상 골라야 마칠 수 있습니다.",
    ]);
  });

  it("최소 인원 미달이면 그 줄만", () => {
    expect(finishSelectionLines({ ...base, block: "min_players_unmet", minPlayers: 3 })).toEqual([
      "최소 인원 3명에 못 미쳐 지금 선발을 마칠 수 없습니다.",
    ]);
  });
});
