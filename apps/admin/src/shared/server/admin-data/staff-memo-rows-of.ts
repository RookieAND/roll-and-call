import type { Snapshot } from "./snapshot";

const SANCTION_MEMO_ACTIONS: readonly string[] = ["제재", "제재 해제"];

export interface StaffMemoRow {
  id: string;
  author: string;
  // 직접 쓴 메모만 있다. 제재·제재 해제 때 쓴 메모는 활동 기록에서 읽어 고치거나 지울 수 없다.
  authorId: string | null;
  direct: boolean;
  tag: string | null;
  at: Date;
  body: string;
}

// 직접 쓴 메모와 제재·제재 해제 때 쓴 운영진 메모를 최신순으로 함께 보인다.
export function staffMemoRowsOf({
  db,
  userId,
}: {
  db: Pick<Snapshot, "staffMemos" | "auditLog">;
  userId: string;
}) {
  const direct: StaffMemoRow[] = db.staffMemos
    .filter((memo) => memo.userId === userId)
    .map((memo) => ({
      id: memo.id,
      author: memo.author,
      authorId: memo.authorId,
      direct: true,
      tag: null,
      at: memo.at,
      body: memo.body,
    }));
  const fromSanctions: StaffMemoRow[] = db.auditLog.flatMap((entry) =>
    entry.targetUserId === userId && entry.staffMemo && SANCTION_MEMO_ACTIONS.includes(entry.action)
      ? [
          {
            id: `audit-${entry.id}`,
            author: entry.actor,
            authorId: null,
            direct: false,
            tag: entry.action,
            at: entry.at,
            body: entry.staffMemo,
          },
        ]
      : [],
  );
  return [...direct, ...fromSanctions].toSorted((a, b) => b.at.getTime() - a.at.getTime());
}
