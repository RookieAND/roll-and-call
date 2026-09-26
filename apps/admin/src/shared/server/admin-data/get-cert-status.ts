import "server-only";
import { editionCertGroups } from "./edition-cert-groups";
import { isSanctioned } from "./is-sanctioned";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

const NINETY_DAYS = 90 * 86_400_000;

export type GmCertState = "unapplied" | "pending" | "certified";

export interface GmCertRow {
  userId: string;
  nickname: string;
  sanctioned: boolean;
  recentSessionCount: number;
  // GM이 될 수 있는 판본("크툴루의 부름 7판").
  certifiedEditions: string[];
  pending: { applicationId: string; rulebook: string; waitedDays: number } | null;
  state: GmCertState;
}

export interface EditionCertRow {
  edition: string;
  certifiedCount: number;
  pendingCount: number;
  unappliedCount: number;
  sessionCount: number;
}

const STATE_ORDER: Record<GmCertState, number> = { unapplied: 0, pending: 1, certified: 2 };

// 인증 현황. 판본마다 GM 자격이 있는 사람·심사 대기·최근 90일에 인증 없이 구인을 연 사람을 센다.
export async function getCertStatus() {
  const db = await loadSnapshot();
  const now = Date.now();
  const pending = db.certApplications.filter((application) => application.status === "pending");
  const groups = editionCertGroups(db.rulebooks);
  const certifiedIdsOf = (userId: string) =>
    new Set(
      db.certifications
        .filter((certification) => certification.userId === userId)
        .map((certification) => certification.rulebookId),
    );

  const gmRows: GmCertRow[] = db.users
    .filter((user) => user.recentHostedCount > 0)
    .map((user) => {
      const certifiedIds = certifiedIdsOf(user.id);
      const application = pending.find((candidate) => candidate.userId === user.id);
      const state: GmCertState = application
        ? "pending"
        : certifiedIds.size > 0
          ? "certified"
          : "unapplied";
      return {
        userId: user.id,
        nickname: user.nickname,
        sanctioned: isSanctioned(user, now),
        recentSessionCount: user.recentHostedCount,
        certifiedEditions: groups
          .filter((group) => group.eligible(certifiedIds))
          .map((group) => group.label),
        pending: application
          ? {
              applicationId: application.id,
              rulebook: application.rulebook,
              waitedDays: waitedDays(application.appliedAt),
            }
          : null,
        state,
      };
    })
    .toSorted(
      (a, b) =>
        STATE_ORDER[a.state] - STATE_ORDER[b.state] || b.recentSessionCount - a.recentSessionCount,
    );

  const editionRows: EditionCertRow[] = groups
    .map((group) => {
      const inEdition = (rulebookId: string | null) =>
        rulebookId !== null && group.bookIds.has(rulebookId);
      const certified = new Set(
        db.users.filter((user) => group.eligible(certifiedIdsOf(user.id))).map((user) => user.id),
      );
      const waiting = new Set(
        pending
          .filter((item) => inEdition(item.rulebookId) && !certified.has(item.userId))
          .map((item) => item.userId),
      );
      const sessions = db.sessions.filter(
        (session) =>
          inEdition(session.rulebookId) && now - session.startsAt.getTime() < NINETY_DAYS,
      );
      const unapplied = new Set(
        sessions
          .map((session) => session.gmId)
          .filter((gmId) => !certified.has(gmId) && !waiting.has(gmId)),
      );
      return {
        edition: group.label,
        certifiedCount: certified.size,
        pendingCount: waiting.size,
        unappliedCount: unapplied.size,
        sessionCount: sessions.length,
      };
    })
    .toSorted((a, b) => b.unappliedCount - a.unappliedCount || b.pendingCount - a.pendingCount);

  return {
    summary: {
      gmCount: gmRows.length,
      certifiedCount: gmRows.filter((row) => row.state === "certified").length,
      pendingCount: gmRows.filter((row) => row.state === "pending").length,
      unappliedCount: gmRows.filter((row) => row.state === "unapplied").length,
    },
    gmRows,
    editionRows,
  };
}

export type CertStatusData = Awaited<ReturnType<typeof getCertStatus>>;
