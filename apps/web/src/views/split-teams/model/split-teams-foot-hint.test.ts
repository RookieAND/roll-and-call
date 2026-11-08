import { describe, expect, it } from "vitest";

import { splitTeamsFootHint } from "./split-teams-foot-hint";
import { toSplitCandidate } from "./to-split-candidate";

const ready = {
  step: 1,
  selectedCount: 3,
  capacityMatched: true,
  visibility: "private" as const,
  scheduleMode: "coordinate" as const,
  rangeStart: "2026-11-14",
  rangeEnd: "2026-11-20",
  startsAt: "",
  endDate: "",
};

describe("splitTeamsFootHint", () => {
  it("1단계는 아무도 고르지 않았을 때만 안내한다", () => {
    expect(splitTeamsFootHint({ ...ready, step: 0, selectedCount: 0 })).toBe(
      "참여자를 고르면 다음으로 갈 수 있습니다.",
    );
    expect(splitTeamsFootHint({ ...ready, step: 0 })).toBeNull();
  });

  it("2단계를 다 채웠으면 안내가 없다", () => {
    expect(splitTeamsFootHint(ready)).toBeNull();
  });

  it("정원이 다르면 먼저 정원을 말한다", () => {
    expect(splitTeamsFootHint({ ...ready, capacityMatched: false, rangeEnd: "" })).toBe(
      "정원과 선택한 참여자 수를 맞추면 구인을 열 수 있습니다.",
    );
  });

  it("남은 일정 칸을 알려 준다", () => {
    expect(splitTeamsFootHint({ ...ready, rangeEnd: "" })).toBe(
      "조율 기간과 시간대를 고르면 구인을 열 수 있습니다.",
    );
    expect(splitTeamsFootHint({ ...ready, scheduleMode: "fixed" })).toBe(
      "세션 일시를 고르면 구인을 열 수 있습니다.",
    );
  });

  it("일반 모집은 모집 마감까지 채워야 한다", () => {
    expect(splitTeamsFootHint({ ...ready, visibility: "public" })).toBe(
      "모집 마감을 고르면 구인을 열 수 있습니다.",
    );
    expect(
      splitTeamsFootHint({ ...ready, visibility: "public", endDate: "2026-11-12T20:00" }),
    ).toBeNull();
  });
});

describe("toSplitCandidate", () => {
  const base = { userId: "u", username: "한지우", bio: "소개" };

  it("신청글이 있으면 첫 줄을, 없으면 소개를 보조 줄로 쓴다", () => {
    expect(toSplitCandidate({ ...base, applicationNote: "첫 줄\n둘째 줄" }).subline).toBe("첫 줄");
    expect(toSplitCandidate({ ...base, applicationNote: null }).subline).toBe("소개");
    expect(toSplitCandidate({ ...base, applicationNote: null, bio: null }).subline).toBeNull();
  });
});
