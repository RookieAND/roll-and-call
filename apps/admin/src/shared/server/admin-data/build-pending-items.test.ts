import { describe, expect, it } from "vitest";

import { buildPendingItems } from "./build-pending-items";

const now = new Date("2026-09-30T12:00:00Z").getTime();
const daysAgo = (days: number) => new Date(now - days * 86_400_000);

describe("buildPendingItems", () => {
  it("인증·추가 요청 2종만 나오고 오래 기다린 종류가 위다", () => {
    const items = buildPendingItems({
      certs: [{ id: "c1", at: daysAgo(2), reviewable: true }],
      rulebookRequests: [{ at: daysAgo(4) }, { at: daysAgo(1) }],
      now,
    });
    expect(items).toEqual([
      { kind: "rulebookRequest", count: 2, oldestDays: 4, oldestId: null },
      { kind: "cert", count: 1, oldestDays: 2, oldestId: "c1" },
    ]);
  });

  it("0건인 종류는 빠진다", () => {
    expect(buildPendingItems({ certs: [], rulebookRequests: [], now })).toEqual([]);
    const items = buildPendingItems({
      certs: [{ id: "c1", at: daysAgo(3), reviewable: true }],
      rulebookRequests: [],
      now,
    });
    expect(items.map((item) => item.kind)).toEqual(["cert"]);
  });

  it("cert의 oldestId는 지금 심사할 수 있는 신청 중 가장 오래된 것이다", () => {
    const [cert] = buildPendingItems({
      certs: [
        { id: "waiting-supplement", at: daysAgo(9), reviewable: false },
        { id: "core", at: daysAgo(6), reviewable: true },
        { id: "newer", at: daysAgo(1), reviewable: true },
      ],
      rulebookRequests: [],
      now,
    });
    expect(cert).toEqual({ kind: "cert", count: 3, oldestDays: 6, oldestId: "core" });
  });
});
