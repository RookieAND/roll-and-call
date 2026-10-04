import { describe, expect, it } from "vitest";

import { leaveDialogCopy } from "./leave-dialog-copy";
import { LEAVE_KIND } from "./leave-kind";

describe("leaveDialogCopy", () => {
  it("D1 참여 취소: 본문 두 줄과 [참여 취소]", () => {
    expect(leaveDialogCopy({ kind: LEAVE_KIND.confirmed, waitlistRank: null })).toEqual({
      buttonLabel: "참여 취소",
      title: "참여를 취소할까요?",
      lines: [
        "취소하면 확정된 자리를 내려놓게 됩니다.",
        "다시 참여하려면 처음부터 신청해야 합니다.",
      ],
      confirmLabel: "참여 취소",
      successMessage: "참여를 취소했습니다",
    });
  });

  it("D2 신청 취소", () => {
    expect(leaveDialogCopy({ kind: LEAVE_KIND.lottery, waitlistRank: null })).toEqual({
      buttonLabel: "신청 취소",
      title: "신청을 취소할까요?",
      lines: ["마감 전에는 언제든 다시 신청할 수 있습니다."],
      confirmLabel: "취소하기",
      successMessage: "신청을 취소했습니다",
    });
  });

  it("D3 대기 취소: 순번을 넣는다", () => {
    expect(leaveDialogCopy({ kind: LEAVE_KIND.waitlist, waitlistRank: 2 })).toEqual({
      buttonLabel: "대기 취소",
      title: "대기를 취소할까요?",
      lines: ["대기 2번 순번이 사라집니다.", "다시 신청하면 맨 뒤 순번으로 들어갑니다."],
      confirmLabel: "취소하기",
      successMessage: "대기를 취소했습니다",
    });
  });
});
