import { describe, expect, it } from "vitest";

import { confirmDialogContent } from "./confirm-dialog-content";

const base = { previousLabel: null, nextLabel: "9월 17일 (목) 20:30 – 23:30", maxPlayers: 4 };

describe("confirmDialogContent", () => {
  it("정원이 차면 경고 없이 알림 안내만 둔다", () => {
    const content = confirmDialogContent({ ...base, confirmedCount: 4 });
    expect(content.warning).toBeNull();
    expect(content.rows[1]?.value).toBe("4 / 4명");
    expect(content.note).toBe("확정 참여자에게 알림이 갑니다.");
  });

  it("정원 미달이면 모집이 닫힌다는 경고를 둔다", () => {
    const content = confirmDialogContent({ ...base, maxPlayers: 6, confirmedCount: 4 });
    expect(content.warning).toEqual(["정원 6명 중 4명으로 확정하면 모집이 닫힙니다."]);
  });

  it("확정 0명이면 경고만 있고 안내 줄은 없다", () => {
    const content = confirmDialogContent({ ...base, confirmedCount: 0 });
    expect(content.rows[1]?.value).toBe("0명");
    expect(content.warning).toHaveLength(2);
    expect(content.note).toBeNull();
  });

  it("변경은 이전·새 시각 행과 대상 수 안내를 보인다", () => {
    const changed = confirmDialogContent({
      ...base,
      previousLabel: "이전 시각",
      confirmedCount: 4,
    });
    expect(changed.rows.map((row) => row.label)).toEqual(["이전", "새 시각"]);
    expect(changed.note).toBe("확정 참여자 4명에게 알림이 갑니다.");
    const none = confirmDialogContent({ ...base, previousLabel: "이전 시각", confirmedCount: 0 });
    expect(none.note).toBe("알릴 참여자가 없습니다.");
  });
});
