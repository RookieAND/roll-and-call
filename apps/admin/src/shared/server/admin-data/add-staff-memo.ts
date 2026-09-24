import "server-only";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";

export async function addStaffMemo(userId: string, actor: string, body: string) {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  db.staffMemos.push({
    id: `m${db.staffMemos.length + 1}`,
    userId,
    author: actor,
    at: new Date(),
    body,
  });
  recordAudit({ actor, action: "운영진 메모", target: user.nickname, reason: body });
}
