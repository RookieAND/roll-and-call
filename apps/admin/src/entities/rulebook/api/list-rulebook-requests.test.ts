import { beforeEach, describe, expect, it, vi } from "vitest";

const { loadAdminData } = vi.hoisted(() => ({ loadAdminData: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/shared/server", () => ({ loadAdminData }));
vi.mock("@/shared/lib", () => ({ waitedDays: () => 1 }));

import { listRulebookRequests } from "./list-rulebook-requests";

function request(id: string, groupId: string | null, done = false) {
  return {
    id,
    groupId,
    userId: "user",
    name: id,
    bookName: id,
    edition: "",
    kind: null,
    category: null,
    note: "",
    requestedAt: new Date("2026-11-09"),
    source: "user",
    gameIds: [],
    outcome: done ? "rejected" : null,
    rejectReason: done ? "중복" : null,
    processed: done ? { by: "운영진", at: new Date(), action: "추가 요청 반려" } : undefined,
  };
}

beforeEach(() =>
  loadAdminData.mockResolvedValue({
    users: [{ id: "user", nickname: "신청자" }],
    sessions: [],
    rulebookRequests: [
      request("done", "group-a", true),
      request("pending", "group-a"),
      request("other", "group-b"),
      request("single-a", null),
      request("single-b", null),
    ],
  }),
);

describe("listRulebookRequests", () => {
  it("대기 목록에서도 같은 묶음의 처리된 책을 전체 권수에 포함한다", async () => {
    const rows = await listRulebookRequests();
    expect(rows.map((row) => row.id)).toEqual(["pending", "other", "single-a", "single-b"]);
    expect(rows[0]).toMatchObject({ groupId: "group-a", groupTotal: 2, groupCompleted: 1 });
    expect(rows[1]).toMatchObject({ groupId: "group-b", groupTotal: 1, groupCompleted: 0 });
  });
  it("묶음 없는 기존 요청은 합산하지 않는다", async () => {
    const rows = await listRulebookRequests();
    expect(rows.slice(-2).map((row) => [row.groupTotal, row.groupCompleted])).toEqual([
      [1, 0],
      [1, 0],
    ]);
  });
  it("묶음 상세에는 처리 결과와 반려 사유를 포함한다", async () => {
    const rows = await listRulebookRequests({ includeProcessed: true });
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({
      outcome: "rejected",
      rejectReason: "중복",
      processed: { by: "운영진" },
    });
  });
});
