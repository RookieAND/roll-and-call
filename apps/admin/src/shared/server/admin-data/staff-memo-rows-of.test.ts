import { describe, expect, it } from "vitest";

import { staffMemoRowsOf } from "./staff-memo-rows-of";

const at = (day: number) => new Date(`2026-09-${String(day).padStart(2, "0")}T00:00:00Z`);

describe("staffMemoRowsOf", () => {
  it("제재·제재 해제 때 쓴 메모를 꼬리표와 함께 최신순으로 섞고, 고칠 수 있는 것은 직접 쓴 메모뿐이다", () => {
    const rows = staffMemoRowsOf({
      userId: "u",
      db: {
        staffMemos: [
          { id: "m1", userId: "u", authorId: "s1", author: "달빛", at: at(19), body: "직접" },
        ],
        auditLog: [
          {
            id: "a1",
            at: at(22),
            actor: "새벽",
            actorKind: "staff",
            action: "제재",
            target: "u",
            targetUserId: "u",
            reason: "반복된 불참",
            staffMemo: "제재 메모",
          },
          {
            id: "a2",
            at: at(25),
            actor: "새벽",
            actorKind: "staff",
            action: "제재 해제",
            target: "u",
            targetUserId: "u",
            reason: "기타",
          },
          {
            id: "a3",
            at: at(26),
            actor: "새벽",
            actorKind: "staff",
            action: "제재",
            target: "x",
            targetUserId: "x",
            reason: "",
            staffMemo: "다른 사람",
          },
        ],
      },
    });
    expect(rows.map(({ body, tag, direct }) => ({ body, tag, direct }))).toEqual([
      { body: "제재 메모", tag: "제재", direct: false },
      { body: "직접", tag: null, direct: true },
    ]);
  });
});
