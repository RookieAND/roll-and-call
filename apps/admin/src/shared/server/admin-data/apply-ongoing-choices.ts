import "server-only";
import { db } from "./mock-db";

export interface OngoingChoice {
  sessionId: string;
  action: "keep" | "leave" | "close";
}

// "참여 빼기"는 명단에서 빼고, "구인 닫기"는 구인을 닫는다. 닫힌 구인 참여자 수를 돌려준다.
export function applyOngoingChoices(userId: string, choices: OngoingChoice[]) {
  let notifiedMembers = 0;
  for (const choice of choices) {
    const session = db.sessions.find((candidate) => candidate.id === choice.sessionId);
    if (!session) continue;
    if (choice.action === "leave") {
      session.memberIds = session.memberIds.filter((memberId) => memberId !== userId);
    }
    if (choice.action === "close" && session.gmId === userId) {
      session.closed = true;
      notifiedMembers += session.memberIds.length;
    }
  }
  return notifiedMembers;
}
