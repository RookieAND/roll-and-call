import { describe, expect, it } from "vitest";

import type { MyRulebook, MyRulebooks } from "@/entities/rulebook";

import { toRequestRow } from "./to-request-row";

type Request = MyRulebooks["requests"][number];

const request = (partial: Partial<Request>): Request => ({
  id: "q",
  label: "네크로니카",
  kind: null,
  createdAt: new Date("2026-09-20T03:00:00Z"),
  outcome: null,
  processedAt: null,
  rejectReason: null,
  ...partial,
});

const book = (partial: Partial<MyRulebook>) =>
  ({ label: "네크로니카", aliases: [], ...partial }) as MyRulebook;

describe("toRequestRow", () => {
  it("검토 중은 요청일을 보인다", () => {
    const row = toRequestRow({ request: request({}), rulebooks: [] });
    expect(row.sub).toBe("09.20 요청");
    expect(row.badge?.label).toBe("검토 중");
  });

  it("추가된 책의 인증 정책에 따라 문구가 다르다", () => {
    const added = request({ outcome: "added", processedAt: new Date("2026-09-28T03:00:00Z") });
    expect(toRequestRow({ request: added, rulebooks: [book({ certRequired: true })] }).sub).toBe(
      "이제 인증을 신청할 수 있습니다",
    );
    expect(toRequestRow({ request: added, rulebooks: [book({ certRequired: false })] }).sub).toBe(
      "인증 없이 구인을 열 수 있습니다",
    );
  });

  it("반려는 처리일과 사유 한 줄을 보인다", () => {
    const rejected = request({
      outcome: "rejected",
      processedAt: new Date("2026-09-28T03:00:00Z"),
      rejectReason: "이미 목록에 있는 책입니다",
    });
    expect(toRequestRow({ request: rejected, rulebooks: [] })).toMatchObject({
      sub: "09.28 처리",
      note: "이미 목록에 있는 책입니다",
      badge: { label: "추가하지 않음", palette: "gray" },
    });
    const withoutReason = toRequestRow({
      request: { ...rejected, rejectReason: null },
      rulebooks: [],
    });
    expect(withoutReason.note).toBeUndefined();
  });
});
