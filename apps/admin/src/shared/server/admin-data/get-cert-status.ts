import "server-only";
import { isSanctioned } from "./is-sanctioned";
import { rulebookLabel } from "./rulebook-label";
import { loadSnapshot } from "./snapshot";
import { waitedDays } from "./waited-days";

const DAY = 86_400_000;
const WEEK = 7 * DAY;
const NINETY_DAYS = 90 * DAY;

export type GmCertState = "unapplied" | "pending" | "certified";

export interface GmCertRow {
  userId: string;
  nickname: string;
  sanctioned: boolean;
  recentSessionCount: number;
  certifiedRulebooks: string[];
  pending: { applicationId: string; rulebook: string; waitedDays: number } | null;
  state: GmCertState;
}

export interface RulebookCertRow {
  rulebook: string;
  certifiedCount: number;
  pendingCount: number;
  unappliedCount: number;
  sessionCount: number;
}

const STATE_ORDER: Record<GmCertState, number> = { unapplied: 0, pending: 1, certified: 2 };

// 인증 현황. allTime이면 룰북별 표의 세션·미신청을 전체 기간으로 센다.
export async function getCertStatus({ allTime }: { allTime: boolean }) {
  const db = await loadSnapshot();
  const now = Date.now();
  const pending = db.certApplications.filter((application) => application.status === "pending");

  const gmRows: GmCertRow[] = db.users
    .filter((user) => user.recentHostedCount > 0)
    .map((user) => {
      const certifiedRulebooks = db.certifications
        .filter((certification) => certification.userId === user.id)
        .map((certification) => certification.rulebook);
      const application = pending.find((candidate) => candidate.userId === user.id);
      const state: GmCertState = application
        ? "pending"
        : certifiedRulebooks.length > 0
          ? "certified"
          : "unapplied";
      return {
        userId: user.id,
        nickname: user.nickname,
        sanctioned: isSanctioned(user, now),
        recentSessionCount: user.recentHostedCount,
        certifiedRulebooks,
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

  const inWindow = (date: Date) => allTime || now - date.getTime() < NINETY_DAYS;
  const rulebookRows: RulebookCertRow[] = db.rulebooks
    .filter((rulebook) => rulebook.certRequired && !rulebook.hidden)
    .map((rulebook) => {
      const label = rulebookLabel(rulebook);
      const certifiedIds = new Set(
        db.certifications.filter((item) => item.rulebook === label).map((item) => item.userId),
      );
      const pendingIds = new Set(
        pending.filter((item) => item.rulebook === label).map((item) => item.userId),
      );
      const sessions = db.sessions.filter(
        (session) => session.rulebook === label && inWindow(session.startsAt),
      );
      const unapplied = new Set(
        sessions
          .map((session) => session.gmId)
          .filter((gmId) => !certifiedIds.has(gmId) && !pendingIds.has(gmId)),
      );
      return {
        rulebook: label,
        certifiedCount: certifiedIds.size,
        pendingCount: pendingIds.size,
        unappliedCount: unapplied.size,
        sessionCount: sessions.length,
      };
    });

  const thisWeek = db.auditLog.filter((entry) => now - entry.at.getTime() < WEEK);
  const rejections = thisWeek.filter((entry) => entry.action === "인증 반려");
  const tagCounts = new Map<string, number>();
  for (const entry of rejections) {
    if (entry.reasonTag) tagCounts.set(entry.reasonTag, (tagCounts.get(entry.reasonTag) ?? 0) + 1);
  }
  const [topTag, topCount] = [...tagCounts].toSorted((a, b) => b[1] - a[1])[0] ?? [];
  const averageWait =
    pending.length === 0
      ? null
      : pending.reduce((sum, item) => sum + waitedDays(item.appliedAt), 0) / pending.length;

  return {
    summary: {
      gmCount: gmRows.length,
      certifiedCount: gmRows.filter((row) => row.state === "certified").length,
      pendingCount: gmRows.filter((row) => row.state === "pending").length,
      unappliedCount: gmRows.filter((row) => row.state === "unapplied").length,
    },
    week: {
      from: new Date(now - WEEK + DAY),
      to: new Date(now),
      approvedCount: thisWeek.filter((entry) => entry.action === "인증 승인").length,
      rejectedCount: rejections.length,
      topRejection: topTag ? { tag: topTag, count: topCount! } : null,
      averageWaitDays: averageWait,
    },
    gmRows,
    rulebookRows,
    guideDm: {
      rulebook: rulebookRows[0]?.rulebook ?? "",
      enforcementDate: db.settings.certEnforcementDate,
    },
  };
}

export type CertStatusData = Awaited<ReturnType<typeof getCertStatus>>;
