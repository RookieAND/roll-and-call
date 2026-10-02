import "server-only";
import { rulebookLabel } from "@roll-and-call/database/rulebooks";
import { compact, uniq } from "es-toolkit";

import { formatSessionTime } from "@/shared/lib";

import { loadSnapshot } from "./snapshot";
import type { Rulebook } from "./types";

const NINETY_DAYS = 90 * 86_400_000;

export interface RulebookImpactCase {
  kind: "unlink" | "require";
  // 자격을 잃는 대상의 이름. 구판 연결 해제면 구판의 판본, 인증 필요로 바꾸면 이 책 이름이다.
  lostName: string;
  losers: { userId: string; nickname: string; meta: string }[];
  games: { id: string; title: string; meta: string }[];
}

interface RulebookImpactInput {
  rulebookId: string;
  supersedesId: string | null;
  certRequired: boolean;
}

// 저장 전에 확인받아야 하는 변경: 포함하는 구판 연결 해제, 인증 정책을 불필요에서 필요로 바꾸기.
export async function getRulebookImpact({
  rulebookId,
  supersedesId,
  certRequired,
}: RulebookImpactInput): Promise<RulebookImpactCase[]> {
  const db = await loadSnapshot();
  const rulebook = db.rulebooks.find((candidate) => candidate.id === rulebookId);
  if (!rulebook) return [];
  const now = Date.now();
  const nicknameOf = (id: string) => db.users.find((user) => user.id === id)?.nickname ?? "";
  const certified = (userId: string, target: Rulebook) =>
    db.certifications.some((item) => item.userId === userId && item.rulebookId === target.id);
  const hosted = (target: Rulebook) =>
    db.sessions.filter((session) => session.rulebookId === target.id && !session.hidden);

  const toCase = ({
    kind,
    lost,
    lostName,
    candidateIds,
  }: {
    kind: RulebookImpactCase["kind"];
    lost: Rulebook;
    lostName: string;
    candidateIds: string[];
  }): RulebookImpactCase => {
    const loserIds = uniq(candidateIds).filter((userId) => !certified(userId, lost));
    const lostSessions = hosted(lost);
    return {
      kind,
      lostName,
      losers: loserIds.map((userId) => {
        const recent = lostSessions.filter(
          (session) => session.gmId === userId && now - session.startsAt.getTime() < NINETY_DAYS,
        ).length;
        return {
          userId,
          nickname: nicknameOf(userId),
          meta: compact([
            `${lostName} 인증 없음`,
            recent > 0 ? `최근 90일 ${lostName} 구인 ${recent}회` : null,
          ]).join(" · "),
        };
      }),
      games: lostSessions
        .filter((session) => session.startsAt.getTime() >= now && loserIds.includes(session.gmId))
        .map((session) => ({
          id: session.id,
          title: session.title,
          meta: [
            `${lost.category} ${lost.edition}`.trim(),
            formatSessionTime(session.startsAt),
            `GM ${nicknameOf(session.gmId)}`,
          ].join(" · "),
        })),
    };
  };

  const cases: RulebookImpactCase[] = [];
  const superseded = db.rulebooks.find((candidate) => candidate.id === rulebook.supersedesId);
  if (superseded && supersedesId !== superseded.id) {
    cases.push(
      toCase({
        kind: "unlink",
        lost: superseded,
        lostName: superseded.edition || rulebookLabel(superseded),
        candidateIds: db.certifications
          .filter((item) => item.rulebookId === rulebook.id)
          .map((item) => item.userId),
      }),
    );
  }
  if (!rulebook.certRequired && certRequired) {
    cases.push(
      toCase({
        kind: "require",
        lost: rulebook,
        lostName: rulebookLabel(rulebook),
        candidateIds: hosted(rulebook)
          .filter((session) => session.startsAt.getTime() >= now)
          .map((session) => session.gmId),
      }),
    );
  }
  return cases;
}
