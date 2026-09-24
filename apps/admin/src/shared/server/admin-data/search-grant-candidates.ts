import "server-only";
import { rulebookLabel } from "./rulebook-label";
import { loadSnapshot } from "./snapshot";

const NINETY_DAYS = 90 * 86_400_000;

export type GrantCandidateState = "pending" | "open" | "certified";

export interface GrantCandidate {
  id: string;
  nickname: string;
  state: GrantCandidateState;
  appliedAt: Date | null;
  approvedAt: Date | null;
  recentSessionCount: number;
  hasApplied: boolean;
}

// GM 직접 추가 검색. 닉네임 일부나 디스코드 ID로 찾고, 이 룰북 기준의 인증 상태를 붙인다.
export async function searchGrantCandidates(
  rulebookId: string,
  query: string,
): Promise<GrantCandidate[]> {
  const keyword = query.trim();
  if (!keyword) return [];
  const db = await loadSnapshot();
  const rulebook = db.rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook) return [];
  const label = rulebookLabel(rulebook);
  const now = Date.now();
  return db.users
    .filter((user) => user.nickname.includes(keyword) || user.discordId === keyword)
    .map((user) => {
      const certification = db.certifications.find(
        (item) => item.userId === user.id && item.rulebook === label,
      );
      const applications = db.certApplications.filter(
        (item) => item.userId === user.id && item.rulebook === label,
      );
      const pending = applications.find((item) => item.status === "pending");
      const state: GrantCandidateState = certification ? "certified" : pending ? "pending" : "open";
      return {
        id: user.id,
        nickname: user.nickname,
        state,
        appliedAt: pending?.appliedAt ?? null,
        approvedAt: certification?.approvedAt ?? null,
        recentSessionCount: db.sessions.filter(
          (session) => session.gmId === user.id && now - session.startsAt.getTime() < NINETY_DAYS,
        ).length,
        hasApplied: applications.length > 0,
      };
    });
}
