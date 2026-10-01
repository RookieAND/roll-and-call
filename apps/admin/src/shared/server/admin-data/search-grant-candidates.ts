import "server-only";
import { rulebookLabel } from "@roll-and-call/database/rulebooks";
import { isUndefined } from "es-toolkit";

import { grantCandidateState } from "./grant-candidate-state";
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
  missingCores: string[];
}

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
  const otherCores =
    rulebook.kind === "core"
      ? db.rulebooks
          .filter(
            (candidate) =>
              candidate.kind === "core" &&
              candidate.id !== rulebook.id &&
              candidate.category === rulebook.category &&
              candidate.edition === rulebook.edition,
          )
          .map(rulebookLabel)
      : [];
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
      const state = grantCandidateState({
        certified: !isUndefined(certification),
        pending: !isUndefined(pending),
      });
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
        missingCores: otherCores.filter(
          (core) =>
            !db.certifications.some((item) => item.userId === user.id && item.rulebook === core),
        ),
      };
    });
}
