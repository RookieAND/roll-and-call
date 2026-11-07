import { describe, expect, it } from "vitest";

import { footerNote } from "./footer-note";

const base = {
  state: "open",
  checkedCount: 0,
  checkableCount: 1,
  reasonPicked: false,
  userReasonFilled: false,
} as const;
const group = { approveCount: 2, rejectCount: 0 };

describe("footerNote", () => {
  it("한 권 신청은 사진 확인 진행을 알린다", () => {
    expect(footerNote(base)).toEqual({
      text: "사진 확인 0/1 · 모두 체크해야 승인할 수 있습니다",
      target: "photos",
    });
    expect(footerNote({ ...base, checkedCount: 1 })).toBeUndefined();
  });

  it("이미 처리된 신청이 가장 먼저다", () => {
    expect(footerNote({ ...base, state: "processed" })?.text).toBe("이미 처리된 신청입니다");
    expect(footerNote({ ...base, state: "processed" })?.target).toBeUndefined();
  });

  it("기본 룰북 심사 대기가 사진 미확인보다 먼저다", () => {
    expect(footerNote({ ...base, state: "waiting" })?.text).toContain("기본 룰북 심사");
  });

  it("거둔 신청은 안내가 없다", () => {
    expect(footerNote({ ...base, state: "withdrawn" })).toBeUndefined();
  });

  it("반려 중에는 사진이 아니라 사유를 요구한다", () => {
    expect(footerNote({ ...base, rejecting: true })?.text).toBe(
      "반려 사유를 골라야 반려할 수 있습니다",
    );
    expect(footerNote({ ...base, rejecting: true, reasonPicked: true })?.text).toBe(
      "사용자에게 보이는 사유를 입력해야 반려할 수 있습니다",
    );
    expect(
      footerNote({ ...base, rejecting: true, reasonPicked: true, userReasonFilled: true }),
    ).toBeUndefined();
  });

  it("묶음에서 승인할 책이 있으면 사진 확인이 먼저다", () => {
    expect(footerNote({ ...base, group })?.target).toBe("photos");
  });

  it("전부 반려하면 사진 확인은 필요 없고 사유만 요구한다", () => {
    const allRejected = { approveCount: 0, rejectCount: 2 };
    expect(footerNote({ ...base, group: allRejected })).toEqual({
      text: "반려 사유를 골라야 반려할 수 있습니다",
      target: "reason",
    });
  });

  it("조건을 갖췄으면 안내가 없다", () => {
    expect(footerNote({ ...base, checkedCount: 1, group })).toBeUndefined();
  });
});
