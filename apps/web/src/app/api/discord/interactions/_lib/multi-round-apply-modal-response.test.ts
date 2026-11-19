import { describe, expect, it } from "vitest";

import { multiRoundApplyModalResponse } from "./multi-round-apply-modal-response";

type Row = { type: number; label?: string; content?: string; component?: { type: number } };

const rows = (response: ReturnType<typeof multiRoundApplyModalResponse>) =>
  (response.data?.components ?? []) as Row[];

describe("다회차 신청 모달", () => {
  it("신청글을 받으면 안내·신청글·체크박스를 한 모달에 둔다", () => {
    const response = multiRoundApplyModalResponse({
      customId: "apply:g1",
      scheduleLine: "총 6회 · 매주 토 오후 12:00~4:00",
      note: { question: null },
    });
    expect(rows(response).map((row) => row.type)).toEqual([10, 18, 18]);
    expect(rows(response)[0]!.content).toBe(
      "총 6회 · 매주 토 오후 12:00~4:00\n마지막 회차까지 함께해 주세요.",
    );
    expect(rows(response)[2]).toMatchObject({
      label: "마지막 회차까지 함께하겠습니다",
      component: { type: 23 },
    });
  });

  it("신청글이 없으면 안내와 체크박스만 둔다", () => {
    const response = multiRoundApplyModalResponse({ customId: "apply:g1", scheduleLine: "총 6회" });
    expect(rows(response).map((row) => row.type)).toEqual([10, 18]);
  });
});
