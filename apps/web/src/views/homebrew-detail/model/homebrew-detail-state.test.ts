import { describe, expect, it } from "vitest";

import { HOMEBREW_DETAIL_ACTION, homebrewDetailState } from "./homebrew-detail-state";

const base = {
  status: "pending" as const,
  hidden: false,
  createdAt: new Date("2026-11-05T03:00:00Z"),
  processedAt: null,
  approvedAt: null,
  rejectTag: null,
  rejectReason: null,
  reapplied: false,
};

describe("homebrewDetailState", () => {
  it("심사 중이면 거두기만 둔다", () => {
    const state = homebrewDetailState(base);
    expect(state.dateLabel).toBe("2026년 11월 5일 신청");
    expect(state.action).toBe(HOMEBREW_DETAIL_ACTION.withdraw);
    expect(state.editable).toBe(false);
    expect(state.guide).toBeNull();
  });

  it("반려 사유는 적은 사유를 먼저, 없으면 태그를 쓰고 다시 낸 신청엔 버튼이 없다", () => {
    const rejected = { ...base, status: "rejected" as const, rejectTag: "자료 부족" };
    expect(homebrewDetailState(rejected).callout?.lines).toEqual(["사유: 자료 부족"]);
    expect(
      homebrewDetailState({ ...rejected, rejectReason: "링크 문서를 열어 볼 수 없습니다." }).callout
        ?.lines,
    ).toEqual(["사유: 링크 문서를 열어 볼 수 없습니다."]);
    expect(homebrewDetailState(rejected).action).toBe(HOMEBREW_DETAIL_ACTION.reapply);
    expect(homebrewDetailState(rejected).guide).toBeNull();
    expect(homebrewDetailState({ ...rejected, reapplied: true })).toMatchObject({
      action: null,
      guide: "이 신청은 고쳐서 다시 신청했습니다.",
    });
  });

  it("승인되면 소개를 고칠 수 있고 숨긴 룰은 못 고친다", () => {
    const approved = {
      ...base,
      status: "approved" as const,
      approvedAt: new Date("2026-11-06T03:00:00Z"),
    };
    expect(homebrewDetailState(approved)).toMatchObject({
      dateLabel: "2026년 11월 6일 승인",
      editable: true,
      callout: null,
      action: null,
      guide: "심사 자료를 바꾸려면 운영진에게 문의해 주세요.",
    });
    const hidden = homebrewDetailState({ ...approved, hidden: true });
    expect(hidden.editable).toBe(false);
    expect(hidden.callout?.colorPalette).toBe("warning");
    expect(hidden.guide).toBe("심사 자료를 바꾸려면 운영진에게 문의해 주세요.");
  });
});
