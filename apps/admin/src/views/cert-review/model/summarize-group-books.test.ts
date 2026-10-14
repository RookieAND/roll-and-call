import { describe, expect, it } from "vitest";

import type { GroupBookEntry } from "./group-books";
import { summarizeGroupBooks } from "./summarize-group-books";

function book(label: string, status: GroupBookEntry["status"], current = false): GroupBookEntry {
  return { label, status, current, href: `/cert/${label}` };
}

describe("summarizeGroupBooks", () => {
  it("건수 줄은 지금 보는 책까지 세고 0건인 상태는 뺀다", () => {
    const summary = summarizeGroupBooks([
      book("가", "approved"),
      book("나", "approved"),
      book("다", "pending", true),
    ]);
    expect(summary.summaryText).toBe("총 3권 · 승인 2 · 대기 1");
  });

  it("묶음은 대기, 승인, 반려, 거둠 순서이고 지금 보는 책을 넣지 않는다", () => {
    const summary = summarizeGroupBooks([
      book("거둔 책", "withdrawn"),
      book("반려 책", "rejected"),
      book("승인 책", "approved"),
      book("지금 책", "pending", true),
      book("대기 책", "pending"),
    ]);
    expect(summary.groups.map(({ status }) => status)).toEqual([
      "pending",
      "approved",
      "rejected",
      "withdrawn",
    ]);
    expect(summary.groups[0]?.books.map(({ label }) => label)).toEqual(["대기 책"]);
    expect(summary.current?.label).toBe("지금 책");
  });

  it("지금 보는 책 말고 처리 전인 책이 없으면 대기 묶음이 없다", () => {
    const summary = summarizeGroupBooks([
      book("승인 책", "approved"),
      book("지금 책", "pending", true),
    ]);
    expect(summary.groups.map(({ status }) => status)).toEqual(["approved"]);
  });

  it("묶음 안 순서는 받은 순서를 지킨다", () => {
    const summary = summarizeGroupBooks([
      book("다", "approved"),
      book("가", "approved"),
      book("나", "approved"),
      book("지금", "pending", true),
    ]);
    expect(summary.groups[0]?.books.map(({ label }) => label)).toEqual(["다", "가", "나"]);
  });
});
